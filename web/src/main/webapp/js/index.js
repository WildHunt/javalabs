var app = null;

$(window).load(function() {

   app = new Application();
   app.init();

});     

var NavElem = function() {

   this.id = -1;
   this.type = "";
   this.elemName = "";
   this.elemBody = null;
   this.elemEdit = null;
   this.expanded = false;
   this.editable = false;

   this.init = function(object, type) {
      this.id = object.id;
      this.type = type;

      this.elemBody = $(document.createElement('div'))
                      .attr('id','nav-body-elem-body')
                      .hide();

      switch(this.type) {

         case 'obj':
            this.elemName = object.objectName;
            var objName = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Name:');
            var objNameValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(this.elemName);
            var objClass = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Class:');
            var objClassValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .click(function() {
                              $(app.tabs['obj']).removeClass('selected'); 
                              app.deactivateButtons();
                              app.getIndexPageData(app.tabs['cls'],-1,object.classPOJO.id); 
                          })
                          .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
                          .append(object.classPOJO.name);
            this.elemBody
            .append(objName).append(objNameValue)
            .append(objClass).append(objClassValue);
            break;

         case 'cls':
            this.elemName = object.name;
            var className = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Name:');
            var classNameValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(this.elemName);
            var classDesc = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Description:');
            var classDescValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(object.description);
            this.elemBody
            .append(className).append(classNameValue)
            .append(classDesc).append(classDescValue);
            break;

         case 'fam':
            this.elemName = object.name;
            var famName = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Name:');
            var famNameValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(this.elemName);
            var famDesc = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Description:');
            var famDescValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(object.description);
            this.elemBody
            .append(famName).append(famNameValue)
            .append(famDesc).append(famDescValue);         
            break;

         case 'stl':
            this.elemName = object.name;
            var styleName = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Name:');
            var styleNameValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append(this.elemName);
            var styleFam = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Family:');
            var styleFamValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .click(function() { 
                              $(app.tabs['stl']).removeClass('selected');
                              app.deactivateButtons();
                              app.getIndexPageData(app.tabs['fam'],-1,object.familyPOJO.id); 
                           })
                          .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
                          .append(object.familyPOJO.name);
            var styleMandatory = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Is mandtory:');
            var styleMandatoryValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append((new Boolean(object.isMandatory)).toString());
            var styleMultiple = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-name')
                          .append('Is multiple:');
            var styleMultipleValue = $(document.createElement('div'))
                          .attr('class','nav-body-elem-field-value')
                          .append((new Boolean(object.isMultiple)).toString());
            this.elemBody
            .append(styleName).append(styleNameValue)
            .append(styleFam).append(styleFamValue)
            .append(styleMandatory).append(styleMandatoryValue)
            .append(styleMultiple).append(styleMultipleValue);  
            break;

      }
   };

   this.getName = function() {
      return this.elemName;
   };

   this.getBody = function() {
      return this.elemBody;
   };

   this.expandBody = function() {
      if(!this.expanded)
         this.elemBody.slideDown(350);
      else
         this.elemBody.slideUp(250);
      this.expanded = !this.expanded;
   };

   this.edit = function(DOMObject) {
      //TODO
      console.info("edit");
   };

   this.del = function(DOMObject) { 
      app.deleteElem(app.tab, app.page, this.id);
   };

}

var Application = function() {

   this.tabs = {
      'obj' : $('#obj'),
      'cls' : $('#cls'),
      'fam' : $('#fam'),
      'stl' : $('#stl'),
   };

   this.buttons = {
      'sch' : $('#nav-search-button'),
      'add' : $('#nav-body-add-button'),
       'up' : $('#nav-body-scroll-up'),
       'dn' : $('#nav-body-scroll-down'),
   };

   this.page = 0;
   this.tab = null;
   this.PAGE_ELEMS = 5;
   this.addFormExpanded = false;

   this.init = function() {
      var app = this;
      var tabs = this.tabs;  
      for(var tab in this.tabs) { 
         this.tabs[tab].hover(
            function() { $(this).addClass('hover');   },
            function() { $(this).removeClass('hover');}
         );  
         this.tabs[tab].click(function() {
            app.page = 0;
            app.tab = tab;
            app.getIndexPageData(this, app.page, -1);
            for(var t in tabs) {
               if(tabs[t].hasClass('selected'))
                  tabs[t].removeClass('selected');
            }
            app.activateButtons();
            $(this).addClass('selected');
            app.buttons['up'].addClass('blocked');
            app.buttons['dn'].addClass('blocked');
            $('#nav-body-add-form').hide().empty();
            app.addFormExpanded = false;
         });
         if(this.tabs[tab].hasClass('selected')) {
            this.getIndexPageData(this.tabs[tab], 0);
            this.buttons['up'].addClass('blocked');
            this.tab = tab;
         }
      }
      var buttons = this.buttons;  
      for(var button in this.buttons) {
         this.buttons[button].hover(
            function() { 
            	if(!$(this).hasClass('blocked')) 
            		$(this).addClass('hover');    
            },
            function() {
               if(!$(this).hasClass('blocked')) 
                  $(this).removeClass('hover');
            }
         ); 
      }
      $('#nav-body-add-form').hide().empty();
      this.buttons['up'].addClass('blocked');
      this.buttons['dn'].addClass('blocked');
      this.buttons['add'].click(function() {
         if(!app.addFormExpanded) {
            app.makeAddForm(app.tab);
            app.addFormExpanded = true;
         }
         else {
            $('#nav-body-add-form').hide().empty();
            app.addFormExpanded = false;
         }
      });
      this.buttons['dn'].click(function() {
         if(!$(this).hasClass('blocked')) {
            app.page++;
            app.getIndexPageData(app.tabs[app.tab], app.page, -1);
            if(app.buttons['up'].hasClass('blocked'))
               app.buttons['up'].removeClass('blocked');
         }
      });
      this.buttons['up'].click(function() {
         if(!$(this).hasClass('blocked')) {
            app.page--;
            app.getIndexPageData(app.tabs[app.tab], app.page, -1);
            if(app.page == 0) {
               $(this).addClass('blocked');
               $(this).removeClass('hover');
            }
         }
      });   
   };

   this.getIndexPageData = function(tab, page, id) {
      var tabName = $(tab).attr('id');
      var url = 'index/' + tabName;
      switch(page) {
         case -1:
            url += ('/id/' + id)
            break;            
         default:
            url += ('/' + page);
            break;
      }
      $('#nav-body-elems')
      .slideUp(250)
      .empty();
      $('#nav-body-message')
      .empty()
      .append('Wait a minute...')
      .show();
      $.ajax({
         url : url,
         type: 'GET',
         dataType: 'json',
         error: function(xhr, textStatus, error) {
            $('#nav-body-message').empty()
            .append('Got error while load data')
            .show()
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
         }
      })
      .done(function(msg) {
         app.makeNavElems(msg, tabName);
      });
      this.tab = tabName;
   };

   this.makeNavElems = function(msg, tabName) {
      $('#nav-body-message')
      .hide().empty();
      console.info(msg);
      if(msg.length != 0) {
         for(var elem in msg) {
            var element = new NavElem();
            element.init(msg[elem], tabName);
            app.makeNavElem(element);
         }
      }
      else {
         $('#nav-body-message')
         .empty()
         .append('No elements')
         .show()
      }
      if(msg.length < app.PAGE_ELEMS) {
         app.buttons['dn'].addClass('blocked');
         app.buttons['dn'].removeClass('hover');
      }
      else
         app.buttons['dn'].removeClass('blocked');
   }

   this.makeNavElem = function(element) {

      var navElemHeader = $(document.createElement('div'))
         .attr('id','nav-body-elem-header');
      
      var navElemBody = element.getBody();

      var navElemName = $(document.createElement('div'))
         .attr('id','nav-body-elem-header-name')
         .html(element.getName())
         .click(function() { element.expandBody(); })
         .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
         .appendTo(navElemHeader);

      var navElemEdit = $(document.createElement('div'))
         .attr('id','nav-body-elem-header-edit')
         .html('Edit')
         .click(function() { element.edit(this); })
         .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
         .appendTo(navElemHeader);

      var navElemDelete = $(document.createElement('div'))
         .attr('id','nav-body-elem-header-delete')
         .html('Delete')
         .click(function() { element.del(this); })
         .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
         .appendTo(navElemHeader);

      var navElem = $(document.createElement('div'))
         .attr('id','nav-body-elem')
         .append(navElemHeader)
         .append(navElemBody);

      $('#nav-body-elems')
      .append(navElem)
      .slideDown(250);
   };

   this.activateButtons = function() {
      for(var but in this.buttons)
         $(this.buttons[but]).removeClass('blocked');
   };

   this.deactivateButtons = function() {
      for(var but in this.buttons)
         $(this.buttons[but]).addClass('blocked');
     
   };

   this.makeAddForm = function(tabName) {
      
      var addMsg = $(document.createElement('div'))
                  .attr('id','nav-body-add-form-message');
      var addForm = $('#nav-body-add-form');
      var addButton =  $(document.createElement('div'))
                  .attr('id','nav-body-add-form-button')
                  .hover(function() { $(this).addClass('hover'); }, function() { $(this).removeClass('hover'); })
                  .append('Add');

      switch(tabName) {
         case 'obj':
            app.buttons['add'].removeClass('blocked');
            app.addFormExpanded = false;
            break;
         
         case 'cls':
            var className = $(document.createElement('div'))
                  .attr('class','nav-body-add-form-name')
                  .append('Name:');
            var classNameValue = $(document.createElement('input'))
                  .attr('class','nav-body-add-form-value')
                  .attr('maxlenght','200');
            var classDesc = $(document.createElement('div'))
                  .attr('class','nav-body-add-form-name')
                  .append('Description:');
            var classDescValue = $(document.createElement('textarea'))
                  .attr('class','nav-body-add-form-value')
                  .attr('maxlenght','1000');
            addButton.click(function() {
               addMsg.empty()
               var classJSON = { 
                  id:-1,
                  name: classNameValue.val(),
                  description: classDescValue.val()
               }
               if(classJSON.name.length != 0)
                  app.addNewElem('cls',app.page,classJSON);
               else
                  addMsg.empty()
                  .append('Incorrect data');
            });
            addForm.append(addMsg)
            .append(className)
            .append(classNameValue)
            .append(classDesc)
            .append(classDescValue)
            .append(addButton)
            .show();
            break;
         
         case 'fam':
            app.buttons['add'].removeClass('blocked');
            app.addFormExpanded = false;
            break;
         
         case 'stl':
            app.buttons['add'].removeClass('blocked');
            app.addFormExpanded = false;
            break;
      }
   };    

   this.addNewElem = function(tabName, page, json) {
      $('#nav-body-elems')
      .slideUp(250)
      .empty();
      $('#nav-body-message')
      .empty()
      .append('Wait a minute...')
      .show();
      $.ajax({
         url : 'index/' + tabName + '/' + page + '/add',
         type: 'GET',
         dataType: 'json',
         data: json,
         error: function(xhr, textStatus, error) {
            $('#nav-body-message').empty()
            .append('Got error while load data')
            .show()
            $('#nav-body-add-form').hide().empty();
            app.addFormExpanded = false;
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
         }
      })
      .done(function(msg) {
         $('#nav-body-add-form').hide().empty();
         app.addFormExpanded = false;
         app.makeNavElems(msg, tabName);
      });
   };

   this.deleteElem = function(tabName, page, id)
   {
      $('#nav-body-elems')
      .slideUp(250)
      .empty();
      $('#nav-body-message')
      .empty()
      .append('Wait a minute...')
      .show();
      $.ajax({
         url : 'index/' + tabName + '/' + page + '/delete/' + id,
         type: 'GET',
         dataType: 'json',
         error: function(xhr, textStatus, error) {
            $('#nav-body-message').empty()
            .append('Got error while load data')
            .show()
            console.log(xhr.statusText);
            console.log(textStatus);
            console.log(error);
         }
      })
      .done(function(msg) {
         app.makeNavElems(msg, tabName);
         for(var elem in msg) {
            if(elem.id == id) {
               $('#nav-body-message')
               .empty()
               .append("Can't delete: this element has external dependency.")
               .show();
            }
         }
      });
   };

//   this.editElem = function(tabName, page, json) {
//      $('#nav-body-elems')
//      .slideUp(250)
//      .empty();
//      $('#nav-body-message')
//      .empty()
//      .append('Wait a minute...')
//      .show();
//      $.ajax({
//         url : 'index/' + tabName + '/' + page + '/edit',
//         type: 'GET',
//         dataType: 'json',
//         data: json,
//         error: function(xhr, textStatus, error) {
//            $('#nav-body-message').empty()
//            .append('Got error while load data')
//            .show()
//            console.log(xhr.statusText);
//            console.log(textStatus);
//            console.log(error);
//         }
//      })
//      .done(function(msg) {
//         app.makeNavElems(msg, tabName);
//      });
//   }
};





