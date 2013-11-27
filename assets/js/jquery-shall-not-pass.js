;(function($, window, document, undefined){
  // Create the defaults once
  var pluginName = "shallNotPass",
  defaults = {
    // Array with default validations
    validations: {
      // Not pass if value ir null or not checked or not selected
      'snp-notnull': function(field){
        // if field is text like
        if(field.attr('type')=='text' || field.attr('type')=='email' || field.attr('type')=='password'){
          // Check if is null and return
          if (field.val() === '') {
            return {
              pass: false,
              errorMsg: 'This field canot be null.'
            };
          };
          return true;
        // If field is radio
        } else if(field.attr('type')=='radio'){
          // make a context
          var context = field.parents('form');
          // get input name
          var radioName = field.attr('name')
          // get all inputs with same name and checked in context
          var radioChecked = context.find('input:radio[name="'+radioName+'"]').is(':checked');
          // if we have some input
          if (!radioChecked) {
            return {
              pass: false,
              errorMsg: 'This field canot be null.'
            };
          };
          return true;
        // Check if field is a checkbox type, if yes
        } else if(field.attr('type')=='checkbox'){
          // And if is checked return true
          if (!field.is(':checked')) {
            return {
              pass: false,
              errorMsg: 'This field canot be null.'
            };
          };
          return true;
        // Check if field is a select, if yes
        } else if(field.is('select')){
          // If field is filled
          if (field.val() === '') {
            return {
              pass: false,
              errorMsg: 'This field canot be null.'
            };
          };
          return true;
        // Check if field is a textarea, if yes
        } else if(field.is('textarea')){
          // If field is filled
          if (field.val() === '') {
            return {
              pass: false,
              errorMsg: 'This field canot be null.'
            };
          };
          return true;
        }
      },
      // This validation check if two fields values are equal
      'snp-equalto': function(field){
        // Get field id
        var baseName = field.attr('id');
        // Target is a field with a class equal (my id + '-same')
        var target = $('.'+baseName+'-same');
        // If two fields have same value
        if (field.val() !== target.val()) {
          return {
              pass: false,
              errorMsg: 'This value are not equal.'
            };
        };
        return true;
      },
      // Test email
      'snp-email': function(field){
        // Check if value match the regex
        var str = field.val();
        // Regex finded in http://regexlib.com/
        var match =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);

        if(match !== true){
          return {
            pass: false,
            errorMsg: 'This is a not valid email.'
          };
        };
        return true;
      },
      // Test date
      'snp-date': function(field){
        // Check if value match the regex
        var str = field.val();
        // Regex finded in http://regexlib.com/
        var match = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/.test(str);

        if(match !== true){
          return {
            pass: false,
            errorMsg: 'This is not a valid date.'
          };
        };
        return true;
      },
      // Test if password have 4~12 digits and at least one numeric
      'snp-password': function(field){
        // Check if value match the regex
        var str = field.val();
        // Regex http://regexlib.com/REDetails.aspx?regexp_id=157
        // Password expresion that requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces.
        // This is merely an extension of a previously posted expression by Steven Smith (ssmith@aspalliance.com) .
        // The no spaces is new.
        var match = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/.test(str);

        if(match !== true){
          return {
            pass: false,
            errorMsg: 'Password must have one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces.'
          };
        };
        return true;
      }
    }
  };

  // The actual plugin constructor
  function Plugin( element, options ) {
    this.element = element;

    this.options = $.extend(true, defaults, options) ;

    this._defaults = defaults;

    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function(callback) {
      // Disabled HTML5 native validation
      $(this.element).attr('novalidate','true');

      var validationsPassed = this._defaults.onValidationsPass;

      // Get all field with class startes with "snp-"
      var fieldsSNP = $(this.element).find("input[class*='snp-'],select[class*='snp-'],textarea[class*='snp-']");

      // If we have fields to validate
      if(fieldsSNP.length > 0){
        // Shortcut to my array with all validations
        var possibleValidation = this._defaults.validations;

        // When form is submited
        $(this.element).on('submit',function(){
          // Control variable used at end
          var formError = false;

          // Clean all erros
          $(this).find('.snp-form-error').remove();

          // Now i start looping all fields
          for (var i = fieldsSNP.length - 1; i >= 0; i--) {
            // Get all classes of the current field
            var fieldClasses = $(fieldsSNP[i]).attr('class');
            // transform in a array
            fieldClasses = fieldClasses.split(' ');

            // If field have a error, clean it
            $(fieldsSNP[i]).parent().removeClass('snp-error');
            $(fieldsSNP[i]).parent().find('.snp-input-error-msg').remove();

            // Control variable to check if an error are finded in current field
            var findError = false;

            // Looping all classes of current field
            for (var j = fieldClasses.length - 1; j >= 0; j--) {
              // If current class name are a function in our array of validations
              if (typeof possibleValidation[fieldClasses[j]] == 'function') {
                // Call the validations passing field
                var validationPass = possibleValidation[fieldClasses[j]]($(fieldsSNP[i]));
                // If we get a false feedback of validation
                if (validationPass.pass === false) {
                  // We find an error
                  findError = true;
                  // Append the error msg in input context
                  $(fieldsSNP[i]).parent().append('<p class="snp-input-error-msg">'+validationPass.errorMsg+'</p>');
                };
              };
            };

            // If we get an error in field
            if (findError) {
              // Form have an error
              formError = true;
              // and the current input get the class snp-error
              $(fieldsSNP[i]).parent().addClass('snp-error');
            };
          };

          // If our form have an error
          if (formError) {
            // Form get an error messenge at top
            $(this).prepend('<p class="snp-form-error">This form shall not pass.</p>');
            // Scrool to the form messege
            $('html, body').animate({
              scrollTop: $(this).offset().top
            }, 500);
            // and put focus at first input with error
            $(this).find('.snp-error input').first().focus();
            // return false and form are not sended
            return false;
          } else {
            if(validationsPassed){
              validationsPassed();
              return false;
            }
          }

        });
      }
    }
  };

  $.fn[pluginName] = function ( options ) {
    if (typeof options === "string") {
      var args = Array.prototype.slice.call(arguments, 1);
      this.each(function() {
        var plugin = $.data(this, 'plugin_' + pluginName);
        plugin[options].apply(plugin, args);
      });
    } else {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
        }
      });
    }
  }

})(jQuery, window, document);