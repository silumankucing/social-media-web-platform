package com.example.basicandroid3

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView

class MainActivity : AppCompatActivity(), View.OnClickListener {
    companion object {
        const val EXTRA_NAME = "extra_name"
        const val EXTRA_UNAME = "extra_uname"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val exploreBtn: Button = findViewById(R.id.explore_btn)
        exploreBtn.setOnClickListener(this)

        val dataName: TextView = findViewById(R.id.profile_name)
        val dataUname: TextView = findViewById(R.id.profile_uname)

        val name = intent.getStringExtra(EXTRA_NAME)
        val uname = intent.getStringExtra(EXTRA_UNAME)

        dataName.text = "$name"
        dataUname.text = "$uname"

    }

    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.explore_btn -> {
                val moveIntentProfile = Intent(this@MainActivity, setting::class.java)
                startActivity(moveIntentProfile)
            }
        }
    }
}