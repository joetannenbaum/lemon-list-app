package com.lemonlist;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.widget.LinearLayout;

import androidx.core.content.ContextCompat;

import com.reactnativenavigation.NavigationActivity;

public class  MainActivity extends NavigationActivity {

  @Override
  protected void addDefaultSplashLayout() {
      LinearLayout splash = new LinearLayout(this);
      // Drawable splash_background = ContextCompat.getDrawable(getApplicationContext(), R.layout.splash_screen);
      Drawable launch_screen_bitmap = ContextCompat.getDrawable(getApplicationContext(),
              R.drawable.launch_screen_bitmap);
      splash.setBackground(launch_screen_bitmap);
      setContentView(splash);
  }


  @Override
  public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }
}
