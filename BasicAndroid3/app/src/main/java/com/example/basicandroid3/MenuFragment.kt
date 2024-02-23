package com.example.basicandroid3

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button

class MenuFragment : Fragment(), View.OnClickListener  {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_menu, container, false)
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val btnCategory: Button = view.findViewById(R.id.testFragment)
        btnCategory.setOnClickListener(this)
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val fragmentManager = supportFragmentManager
        val homeFragment = MenuFragment()
        val fragment = fragmentManager.findFragmentByTag(MenuFragment::class.java.simpleName)

        if (fragment !is MenuFragment) {
            Log.d("MyFlexibleFragment", "Fragment Name :" + MenuFragment::class.java.simpleName)
            fragmentManager
                .beginTransaction()
                .add(R.id.frame_container, homeFragment, MenuFragment::class.java.simpleName)
                .commit()
        }
    }

    override fun onClick(v: View?) {

    }
}