$(document).ready(function() {
      $('#start').focus();
    });

    function showSubMenu() {
      $('#main_menu').hide();
      $('#sub-menu').show();
      $('#tutorial').focus();
      readMenu(document.getElementById('tutorial'));
    }
    function showMainMenu() {
      $('#main_menu').show();
      $('#sub-menu').hide();
      $('#start').focus();
      readMenu(document.getElementById('start'));
    }
    function hideMenus() {
      $('#main_menu').hide();
      $('#sub-menu').hide();
    }
    function downMenu() {
      audioManager.stop( lastSoundObj );
      audioManager.stop( globalMenu.menu_intro );
      if($("#main_menu").is(":visible")) {
        list = ['start','select_level', 'survival_mode'];
        playlist = [ globalMenu.startgame, globalMenu.selectlevel, globalMenu.survival_mode ];
      } else {
        list = ['back_to_menu','tutorial','level1','level2','level3'];
        playlist = [ globalMenu.mainmenu, globalMenu.tutorial, globalMenu.level1, globalMenu.level2, globalMenu.level3];
      }

      var selectedMenu = $('.button_class:focus').attr('id');
      var num = -1;
      for (var i = 0; i < list.length; i++){
        if (selectedMenu == list[i]){
          num = i;
        }
      }
      if (num == list.length - 1)
        num = 0;
      else if(num >= 0)
        num = num + 1;
      else if(num == -1)
        num = list.length -1;
      var newMenu = list[num];
      $(document.getElementById(newMenu)).focus();
      lastSoundObj.name = list[num];
      audioManager.play( playlist[num] );
    }

    var lastSoundObj = {
      name: ""
    }

     function upMenu() {
      audioManager.stop( lastSoundObj );
      audioManager.stop( globalMenu.menu_intro );
      if ($("#main_menu").is(":visible")) {
        list = ['start','select_level', 'survival_mode'];
        playlist = [ globalMenu.startgame, globalMenu.selectlevel, globalMenu.survival_mode ];
      } else {
        list = ['back_to_menu','tutorial','level1','level2','level3'];
        playlist = [ globalMenu.mainmenu, globalMenu.tutorial, globalMenu.level1, globalMenu.level2, globalMenu.level3];
      }

      var selectedMenu = $('.button_class:focus').attr('id');
      var num = -1;
      for (var i = 0; i < list.length; i++){
        if (selectedMenu == list[i]){
          num = i;
        }
      }
      if(num == 0)
        num = list.length - 1;
      else if(num >= 0)
        num = num - 1;
       else if(num == -1)
        num = 0;
      var newMenu = list[num];
      $(document.getElementById(newMenu)).focus();
      lastSoundObj.name = list[num];
      audioManager.play( playlist[num] );
    }

    function readMenu(x) {
      audioManager.stop( lastSoundObj );
      audioManager.stop( globalMenu.menu_intro );
      if ($("#main_menu").is(":visible")) {
        list = ['start','select_level', 'survival_mode'];
        playlist = [ globalMenu.startgame, globalMenu.selectlevel, globalMenu.survival_mode ];
      } else {
        list = ['back_to_menu','tutorial','level1','level2','level3'];
        playlist = [ globalMenu.mainmenu, globalMenu.tutorial, globalMenu.level1, globalMenu.level2, globalMenu.level3];
      }

      var selectedMenu = x.id;
      var num = -1;
      for (var i = 0; i < list.length; i++){
        if (selectedMenu == list[i]){
          num = i;
        }
      }
      var newMenu = list[num];
      $(document.getElementById(newMenu)).focus();
      lastSoundObj.name = list[num];
      audioManager.play( playlist[num] );
    }