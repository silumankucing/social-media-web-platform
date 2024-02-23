package com.example.basicandroid3

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity

class setting : AppCompatActivity(), View.OnClickListener {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_setting)

        val dataName:EditText = findViewById(R.id.setting_name_edit)
        dataName.setOnClickListener(this)

        val dataUname:EditText = findViewById(R.id.setting_uname_edit)
        dataUname.setOnClickListener(this)

        val profileBtn: Button = findViewById(R.id.setting_save)
        profileBtn.setOnClickListener(this)

        val data_name = dataName.text.toString()
        val data_uname = dataUname.text.toString()
    }
    override fun onClick(v: View?) {
        when (v?.id) {
            R.id.setting_save -> {
                val moveIntentProfile = Intent(this@setting, MainActivity::class.java)
                moveIntentProfile.putExtra(MainActivity.EXTRA_NAME, "Kuro")
                moveIntentProfile.putExtra(MainActivity.EXTRA_UNAME, "anggasaputra")
                startActivity(moveIntentProfile)
            }
        }
    }
}
