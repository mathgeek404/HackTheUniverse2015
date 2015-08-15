#include "pebble.h"
#include<stdio.h>
 
static Window *window;
 
static TextLayer *money_layer;
static TextLayer *phone_layer;
static BitmapLayer *icon_layer;
static TextLayer *resp_y_layer;
 
static GBitmap *icon_bitmap = NULL;
 
static AppSync sync;
static uint8_t sync_buffer[64];
 
bool data_handshake;
bool tap_handshake;

float payment_size;
 
enum ShakeKeys {
  ID_KEY = 0x0,         // TUPLE_INT
  NAME_KEY = 0x1,  // TUPLE_CSTRING
 PHONE_KEY = 0x2
};



static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
    

}

static void inbox_dropped_callback(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Message dropped!");
}

static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_ERROR, "Outbox send failed!");
}

static void outbox_sent_callback(DictionaryIterator *iterator, void *context) {
  APP_LOG(APP_LOG_LEVEL_INFO, "Outbox send success!");
}


void accel_data_handler(AccelData *data, uint32_t num_samples) {
  // Process 10 events - every 1 second
 
  if (data->did_vibrate) {   
      return;
  }
    
  APP_LOG(APP_LOG_LEVEL_ERROR, "Handle");
  int total_x = 0;
  int total_y = 0;
  int total_z = 0;
  int avg_x = 0;
  int avg_y = 0;
  int avg_z = 0;
    
  int max_y = 0;
  int min_y = 2000;
    
  for(uint32_t i = 0; i < num_samples; i++)
    {
      total_x += (int)data[i].x;
      total_y += (int)data[i].y;
      total_z += (int)data[i].z;
      max_y = (max_y < (int)data[i].y ? (int)data[i].y : max_y);
      min_y = (min_y > (int)data[i].y ? (int)data[i].y : min_y);
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
 
  //if ((int)avg_y > 400)
    if (max_y > 900)
    {
      //if ( (int)avg_x < 200 )
        if (min_y < 200)
	{
	  //if ( (int) avg_z < 200)
	   // {
	      APP_LOG(APP_LOG_LEVEL_ERROR, "accel data detected!!");
	      // Begin dictionary
          uint8_t buffer[20];
	      DictionaryIterator *iter;
          app_message_outbox_begin(&iter);
          APP_LOG(APP_LOG_LEVEL_ERROR, "Got Here");
          dict_write_begin(iter, buffer, sizeof(buffer));
          // Write the Data:
          char* str = malloc(20);
          snprintf(str, sizeof(str), "$%d.%02d", (int)payment_size, (int)(payment_size*100)%100);
          dict_write_cstring(iter, 404, str);
          // End:
          const uint32_t final_size = dict_write_end(iter);
          
          APP_LOG(APP_LOG_LEVEL_ERROR, "Sending");
	      // Send the message!
            
          vibes_short_pulse();
	      app_message_outbox_send();
	      
	    }
	//}
       
    }
}



// Money WatchFace Window
static void window_money_load(Window *window) {
  // Create time TextLayer
  money_layer = text_layer_create(GRect(0, 55, 144, 50));
  text_layer_set_background_color(money_layer, GColorClear);
  text_layer_set_text_color(money_layer, GColorBlack);
    
  char *str = malloc(20);
  snprintf(str, sizeof(str), "$%d.%02d", (int)payment_size, (int)(payment_size*100)%100);
  text_layer_set_text(money_layer, str);

  // Improve the layout to be more like a watchface
  text_layer_set_font(money_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  text_layer_set_text_alignment(money_layer, GTextAlignmentCenter);

  // Add it as a child layer to the Window's root layer
  layer_add_child(window_get_root_layer(window), text_layer_get_layer(money_layer));
}


static void window_money_unload(Window *window) {
    text_layer_destroy(money_layer);
}

static void up_click_payment_handler(ClickRecognizerRef recognizer, void *context) {
    APP_LOG(APP_LOG_LEVEL_ERROR, "CLICKUP");
    payment_size += 1.00;
    char *str = malloc(20);
    snprintf(str, sizeof(str), "$%d.%02d", (int)payment_size, (int)(payment_size*100)%100);
    text_layer_set_text(money_layer, str);
}

static void select_click_payment_handler(ClickRecognizerRef recognizer, void *context) {
  text_layer_set_text(money_layer, "Select pressed!");
}

static void down_click_payment_handler(ClickRecognizerRef recognizer, void *context) {
  payment_size -= 1.00;
  char *str = malloc(20);
  snprintf(str, sizeof(str), "$%d.00", (int)payment_size); //, (int)(payment_size*100)%100
  text_layer_set_text(money_layer, str);
}

static void click_config_provider(void *context) {
  // Register the ClickHandlers
  window_single_click_subscribe(BUTTON_ID_UP, up_click_payment_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_payment_handler);
}


static void init(void) {
  window = window_create();
  window_set_background_color(window, GColorWhite);
  //window_set_fullscreen(window, true);
  window_set_window_handlers(window, (WindowHandlers) {
    .load = window_money_load,
    .unload = window_money_unload
  	}); 
  window_set_click_config_provider(window, &click_config_provider);
 
  const int inbound_size = 64;
  const int outbound_size = 64;
  app_message_open(inbound_size, outbound_size);
 
  const bool animated = true;
 
  data_handshake = true;
  tap_handshake = false;
    
  payment_size = 5.00;
 
  //createPopup();
    
    

  // Register callbacks
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(inbox_dropped_callback);
  app_message_register_outbox_failed(outbox_failed_callback);
  app_message_register_outbox_sent(outbox_sent_callback);
 
  accel_service_set_samples_per_update(10);
  accel_service_set_sampling_rate(ACCEL_SAMPLING_10HZ);
  accel_data_service_subscribe(10, accel_data_handler);
  //accel_tap_service_subscribe(&accel_tap_handler);
  //tick_timer_service_subscribe(SECOND_UNIT, &handle_tick);
    
  window_stack_push(window, animated);
}


static void deinit(void) {
  window_destroy(window);
  accel_data_service_unsubscribe();
}


int main(void) {
  init();
  app_event_loop();
  deinit();
}
