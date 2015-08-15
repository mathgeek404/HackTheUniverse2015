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
 


int main(void) {
  init();
  app_event_loop();
  deinit();
}
