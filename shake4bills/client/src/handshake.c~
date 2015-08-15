#include "pebble.h"
 
static Window *window;
 
static TextLayer *name_layer;
static TextLayer *phone_layer;
static BitmapLayer *icon_layer;
static TextLayer *resp_y_layer;
 
static GBitmap *icon_bitmap = NULL;
 
static AppSync sync;
static uint8_t sync_buffer[64];
 
bool data_handshake;
bool tap_handshake;
 
enum ShakeKeys {
  ID_KEY = 0x0,         // TUPLE_INT
  NAME_KEY = 0x1,  // TUPLE_CSTRING
 PHONE_KEY = 0x2
};
 

tatic void init(void) {
  //window = window_create();
  //window_set_background_color(window, GColorWhite);
  //window_set_fullscreen(window, true);
  //window_set_window_handlers(window, (WindowHandlers) {
  //    .load = window_load,
  // .unload = window_unload
  //	});
 
  // window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
 
  //window_set_click_config_provider(window, &click_config_provider);
 
  const int inbound_size = 64;
  const int outbound_size = 64;
  app_message_open(inbound_size, outbound_size);
 
  const bool animated = true;
 
  data_handshake = true;
  tap_handshake = false;
 
  //createPopup();
 
  accel_service_set_samples_per_update(25);
  accel_data_service_subscribe(25, &accel_data_handler);
  //accel_tap_service_subscribe(&accel_tap_handler);
  //tick_timer_service_subscribe(SECOND_UNIT, &handle_tick);
  accel_service_set_sampling_rate(ACCEL_SAMPLING_10HZ);
 
  //window_stack_push(window, animated);
}

void accel_data_handler(AccelData *data, uint32_t num_samples) {
  // Process 10 events - every 1 second
 
  int total_x = 0;
  int total_y = 0;
  int total_z = 0;
  int avg_x = 0;
  int avg_y = 0;
  int avg_z = 0;
  for(uint32_t i = 0; i < num_samples; i++)
    {
      total_x += (int)data[i].x;
      total_y += (int)data[i].y;
      total_z += (int)data[i].z;
    }
 
  avg_x = total_x/(int)num_samples;
  avg_y = total_y/(int)num_samples;
  avg_z = total_z/(int)num_samples;
 
  char *str_x="xxxxxxxxxx";
  snprintf(str_x, sizeof(str_x), "%d", avg_x);
  APP_LOG(APP_LOG_LEVEL_ERROR, str_x);
 
  char *str_y="xxxxxxxxxx";
  snprintf(str_y, sizeof(str_y), "%d", avg_y);
  APP_LOG(APP_LOG_LEVEL_ERROR, str_y);
 
  char *str_z="xxxxxxxxxx";
  snprintf(str_z, sizeof(str_z), "%d", avg_z);
  APP_LOG(APP_LOG_LEVEL_ERROR, str_z);
 
  if ((int)avg_y > 400)
    {
      if ( (int)avg_x < 200 )
	{
	  if ( (int) avg_z < 200)
	    {
	      APP_LOG(APP_LOG_LEVEL_ERROR, "accel data detected!!");
	      
	    }
	}
       
    }
}

static void deinit(void) {
  //window_destroy(window);
}


int main(void) {
  init();
  app_event_loop();
  deinit();
}
