package com.example.smandala.myapplication;




import android.app.Activity;
import android.app.ActionBar;
import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.os.Build;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.ToggleButton;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import com.getpebble.android.kit.PebbleKit;

import com.getpebble.android.kit.PebbleKit.PebbleDataReceiver;
import com.getpebble.android.kit.util.PebbleDictionary;

import javax.net.ssl.HttpsURLConnection;


public class MainActivity extends Activity {
    private Context mContext = this;
    private TextView tv;
    private File file=null;
    private BufferedWriter writer=null;
    private boolean pebble_flag=false;
    private String fileName="default.csv";
    private boolean raw_close = false;
    private Timer mTimer;
    private PebbleMessenger mPebbleMessenger;
    private PebbleDataReceiver appMessageReceiver;
    private final static UUID PEBBLE_APP_UUID = UUID.fromString("26580efd-9bcc-48ba-97b9-0ec00104d888a");




    @Override
	protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        boolean writable=isExternalStorageWritable();
        File path= Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
        path.mkdirs();
        file=new File(path,fileName);
        try{
            writer = new BufferedWriter(new FileWriter(file,true));
        } catch (IOException e) {
            e.printStackTrace();
        }

    }


    @Override
	public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
	protected void onResume() {
        super.onResume();

        // Define AppMessage behavior
        if(appMessageReceiver == null) {
            appMessageReceiver = new PebbleDataReceiver(PEBBLE_APP_UUID) {

                @Override
		    public void receiveData(Context context, int transactionId, PebbleDictionary data) {
                    // Always ACK
                    PebbleKit.sendAckToPebble(context, transactionId);

                    // What message was received?
		    String url;
		    String urlParameters;
		    System.out.println("DAMN");

		    if(data.contains(1)) {
			//Send

			int money = data.getInteger(1).intValue();

			url = "http://2454d496.ngrok.io/give";
			urlParameters = "amount=500&password:passwordpassword&lat=10&lon=10&identifier=92e01fc7-8111-422d-b408-45d87ea9f343&address=12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox";

		    }
		    else {
			//Get
			url = "http://2454d496.ngrok.io/get";
			urlParameters = "amount=500&password=passwordpassword&lat=10&lon=10&identifier=92e01fc7-8111-422d-b408-45d87ea9f343&address=12bFNtivVbnNWoNqZfXFJcsAHiLG4e7wox";

		    }

		    try {

			URL obj = new URL(url);
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

			//add reuqest header
			con.setRequestMethod("POST");
			//con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");


			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();

			int responseCode = con.getResponseCode();
			System.out.println("\nSending 'POST' request to URL : " + url);
			System.out.println("Post parameters : " + urlParameters);
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
		    }
		    catch (Exception ex) {


		    }
		    finally {

		    }
		}
                };
	}verride
	     public boolean onOptionsItemSelected(MenuItem item) {
	    // Handle action bar item clicks here. The action bar will
	    // automatically handle clicks on the Home/Up button, so long
	    // as you specify a parent activity in AndroidManifest.xml.
	    int id = item.get }
    }
    Log.d("destroy","destroyed");
}

}