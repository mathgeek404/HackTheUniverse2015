package com.example.rishimasand.shake4bills;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;

import com.getpebble.android.kit.PebbleKit;
import com.getpebble.android.kit.PebbleKit.PebbleDataReceiver;
import com.getpebble.android.kit.util.PebbleDictionary;

import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.Date;
import java.util.UUID;
import java.util.zip.GZIPInputStream;


public class MainActivity extends Activity {
    private PebbleDataReceiver appMessageReceiver;
    private final static UUID PEBBLE_APP_UUID = UUID.fromString("214839d4-403a-4952-8926-49cdabe62753");

    private class PostCall extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... params) {

            try {
                DefaultHttpClient httpclient = new DefaultHttpClient();
                HttpPost httpPostRequest = new HttpPost(params[0]);
                StringEntity se = null;
                se = new StringEntity(params[1]);
                httpPostRequest.setEntity(se);
                httpPostRequest.setHeader("Accept", "application/json");
                httpPostRequest.setHeader("Content-Type", "application/json");
                httpPostRequest.setHeader("Accept-Encoding", "gzip");

                System.out.println("Loaded data123");
                long t = System.currentTimeMillis();
                HttpResponse response = (HttpResponse) httpclient.execute(httpPostRequest);

                // Get hold of the response entity (-> the data):
                HttpEntity entity = response.getEntity();

                if (entity != null) {
                    // Read the content stream
                    InputStream instream = entity.getContent();
                    System.out.println("Loaded nope " +
                            "d0" +
                            "63" +
                            "3" +
                            "6+3" +
                            "ata");
                    Header contentEncoding = response.getFirstHeader("Content-Encoding");
                    if (contentEncoding != null && contentEncoding.getValue().equalsIgnoreCase("gzip")) {
                        instream = new GZIPInputStream(instream);
                    }

                    // convert content stream to a String
                    System.out.println("Loaded datayeah");
                    instream.close();
                    System.out.println("ARGOFCKTEAH");

                    //Utility.Log(TAG, Utility.getMethodName(), "resultString = " + resultString);
                    // Transform the String into a JSONObject
                    // JSONObject jsonObjRecv = new JSONObject(resultString);
                    // Raw DEBUG output of our received JSON object:
                }


            } catch (Exception e) {
                // More about HTTP exception handling in another tutorial.
                // For now we just print the stack trace.
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(String result) {
        }

        @Override
        protected void onPreExecute() {
        }

        @Override
        protected void onProgressUpdate(Void... values) {
        }
    }


//    SharedPreferences prefs = this.getSharedPreferences(
//            "com.example.app", Context.MODE_PRIVATE);

    //EditText mEdit;



    public void saveCreds(){
//        prefs.edit().putString("identifier", mEdit.getText().toString());
//        prefs.edit().putString("address", mEdit.getText().toString());
//        prefs.edit().putString("identifier", mEdit.getText().toString());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //mEdit = (EditText)findViewById(R.id.editText);

        PebbleKit.startAppOnPebble(getApplicationContext(), PEBBLE_APP_UUID);

        BroadcastReceiver broadcastReceiver = PebbleKit.registerReceivedDataHandler(this, new PebbleDataReceiver(PEBBLE_APP_UUID) {

            @Override
            public void receiveData(final Context context, final int transactionId, final PebbleDictionary data) {
                Log.i("TAG", "received data for transaction " + data.getInteger(1));
                int payAmount = data.getInteger(1).intValue();

                String url;
                String urlParameters;
                JSONObject params = new JSONObject();

                if (payAmount > 0) {

                    //url = "http://528142c4.ngrok.io/give";
                    url="http://bc4d3bf1.ngrok.io/give";
                    try {
                        params.put("amount", payAmount);
                        params.put("address","12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox");
                        params.put("identifier","a6b1898e-fb9b-4384-a26c-fe8b038a0aad");
                        params.put("password","Iamkira@777");
                    } catch (Exception e) {
                    }


                    //urlParameters = "amount=500&password:passwordpassword&lat=10&lon=10&identifier=92e01fc7-8111-422d-b408-45d87ea9f343&address=12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox";
                    //give
                    //Send
                } else {
                    url = "http://bc4d3bf1.ngrok.io/receive";
                    try {
                        params.put("address","12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox");
                        params.put("identifier","a6b1898e-fb9b-4384-a26c-fe8b038a0aad");
                    } catch (Exception e) {
                    }
                }
                System.out.println("Loaded data");
                try {
                    Date date = new Date();
                    long timeMilli = date.getTime();

                    /*
                    Location mLastLocation = LocationServices.FusedLocationApi.getLastLocation(
                            mGoogleApiClient);
                    if (mLastLocation != null) {
                        mLatitudeText.setText(String.valueOf(mLastLocation.getLatitude()));
                        mLongitudeText.setText(String.valueOf(mLastLocation.getLongitude()));
                    }
                    */
                    System.out.println("Got data");
                    params.put("password", "Iamkira@777");
                    params.put("time", Integer.toString((int) timeMilli));
                }
                catch (Exception ex) {}

                String[] p = {url,params.toString()};
                    new PostCall().execute(p);


                    //URL obj = new URL(url);



                    //HttpURLConnection con = (HttpURLConnection) obj.openConnection();
                    //System.out.println("Initial HTTP Setups");

/*
                    //add reuqest header
                    con.setRequestMethod("POST");
                    con.setRequestProperty("User-Agent", System.getProperty("http.agent"));
                    con.setRequestProperty("Content-Language", "en-US");
                    con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");s
                    con.setUseCaches(false);
                    System.out.println("Property Setups");


                    // Send post request
                    //con.setDoInput(true);
                    System.out.println("Initial HTTP Setups1");
                    con.setDoOutput(true);
                    System.out.println("Initial HTTP Setups2");
                    con.setRequestProperty("Content-Type", "application/json");
                    System.out.println("Initial HTTP Setups3");
                    con.setRequestProperty("Accept", "application/json");
                    OutputStream stream_o = con.getOutputStream();
                    System.out.println("Initial HTTP Setups4");
                    DataOutputStream wr = new DataOutputStream(stream_o);
                    System.out.println("Initial HTTP Setups5");
                    wr.writeBytes("");
                    System.out.println("Initial HTTP Setups6");
                    wr.flush();
                    wr.close();
                    System.out.println("Stream Setups");

                    int responseCode = con.getResponseCode();
                    System.out.println("\nSending 'POST' request to URL : " + url);
                    System.out.println("Post parameters : " + params.toString());
                    System.out.println("Response Code : " + responseCode);

                    BufferedReader in = new BufferedReader(
                            new InputStreamReader(con.getInputStream()));
                    String inputLine;
                    StringBuffer response = new StringBuffer();

                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                    in.close();

                    //print result
                    System.out.println(response.toString());
                } catch (Exception ex) {
                    System.out.print("MISSION CONTROL");
                    System.out.print(ex);
                }
                */

                PebbleKit.sendAckToPebble(getApplicationContext(), transactionId);
            }
        });

        PebbleKit.registerReceivedAckHandler(getApplicationContext(), new PebbleKit.PebbleAckReceiver(PEBBLE_APP_UUID) {

            @Override
            public void receiveAck(Context context, int transactionId) {
                Log.i(getLocalClassName(), "Received ack for transaction " + transactionId);
            }

        });

        PebbleKit.registerReceivedNackHandler(getApplicationContext(), new PebbleKit.PebbleNackReceiver(PEBBLE_APP_UUID) {

            @Override
            public void receiveNack(Context context, int transactionId) {
                Log.i(getLocalClassName(), "Received nack for transaction " + transactionId);
            }
        });

        /*mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
                */

    }
}