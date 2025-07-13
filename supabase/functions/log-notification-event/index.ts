import { createClient } from 'npm:@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface NotificationEventPayload {
  user_id: string;
  notification_id: string;
  event_type: 'clicked' | 'viewed';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === 'POST') {
      const payload: NotificationEventPayload = await req.json();

      console.log('📊 Logging notification event:', {
        user_id: payload.user_id,
        notification_id: payload.notification_id,
        event_type: payload.event_type,
      });

      // Validate inputs
      if (!payload.user_id || !payload.notification_id || !payload.event_type) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing required fields: user_id, notification_id, event_type' 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Validate event_type
      if (!['clicked', 'viewed'].includes(payload.event_type)) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid event_type. Must be "clicked" or "viewed"' 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Validate UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(payload.user_id) || !uuidRegex.test(payload.notification_id)) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid UUID format for user_id or notification_id' 
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      try {
        // Insert into notification_events (use ON CONFLICT DO NOTHING to prevent duplicates)
        const { error: eventError } = await supabase
          .from('notification_events')
          .insert({
            user_id: payload.user_id,
            notification_id: payload.notification_id,
            event_type: payload.event_type,
          });

        // If the event already exists, that's fine - we just won't increment again
        if (eventError && !eventError.message.includes('duplicate key')) {
          console.error('❌ Error inserting notification event:', eventError);
          throw eventError;
        }

        // Only increment counters if this is a new event (no duplicate key error)
        if (!eventError) {
          // Increment the appropriate counter
          const countField = payload.event_type === 'clicked' ? 'click_count' : 'view_count';
          
          const { error: counterError } = await supabase.rpc('increment_notification_counter', {
            p_notification_id: payload.notification_id,
            p_column_name: countField,
          });

          if (counterError) {
            console.error('❌ Error incrementing counter:', counterError);
            throw counterError;
          }

          // If this is a click event, also add user to clicked_user_ids array
          if (payload.event_type === 'clicked') {
            const { error: clickedError } = await supabase.rpc('add_user_to_clicked_list', {
              p_notification_id: payload.notification_id,
              p_user_id: payload.user_id,
            });

            if (clickedError) {
              console.error('❌ Error adding user to clicked list:', clickedError);
              // Don't throw here - this is optional functionality
            }
          }

          console.log(`✅ Successfully logged ${payload.event_type} event for notification ${payload.notification_id}`);
        } else {
          console.log(`ℹ️ Event already logged for user ${payload.user_id} on notification ${payload.notification_id}`);
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: `${payload.event_type} event logged successfully`,
            event_type: payload.event_type,
            notification_id: payload.notification_id,
          }),
          {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );

      } catch (dbError) {
        console.error('❌ Database error:', dbError);
        return new Response(
          JSON.stringify({
            error: 'Database operation failed',
            details: dbError.message,
          }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
    }

    // GET request - return recent notification events for debugging
    const { data: events, error } = await supabase
      .from('notification_events')
      .select(`
        *,
        notifications(title, type),
        user_profiles(user_id)
      `)
      .order('event_time', { ascending: false })
      .limit(50);

    if (error) {
      throw new Error(`Failed to fetch notification events: ${error.message}`);
    }

    return new Response(
      JSON.stringify({ 
        events: events || [],
        total: events?.length || 0,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('❌ Notification event logging error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process notification event',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});