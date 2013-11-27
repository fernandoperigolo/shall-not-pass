Shall Not Pass - Form Validation jQuery Plugin (another)
============================================

I created this plugin for personal use, but i think is time to get feedbacks and improve it.

I started using a jQuery Boilerplate and improve it adding method support. The code have a lot of comments, i hope it make easy to understand what are happening.

This project have a tests folder with Jasmine. I manage to write all tests to make easy new releases.

It is a really easy to use jquery plugin. Check it out the tips bellow.

- All validation are based in input classes. If your input have a class who starts with "snp-", it will be validated. Ex.: snp-notnull, snp-password, ...

- When a validation dont pass, the parent container of the input in question gain a class ".snp-error". Take it in mind.

- When a validation dont pass, page scroll to begin of form and take focus on first input with an error.

- To run the plugin:
```javascript
$('form').shallNotPass();
```

- You can pass a 'onValidationsPass' parameter. That will be called when all validations pass. Good to make a AJAX call.
```javascript
$('form').shallNotPass({
    onValidationsPass: function(){
        console.info('onValidationsPass triggered');
    }
});
```
If you dont pass this parameter, form will follow the action as expected.

- You can add your custons validations.
```javascript
$('form').shallNotPass({
    validations: {
        'snp-foo': function(field){
            if(field.val() !== 'foos'){
                return {
                    pass: false,
                    errorMsg: 'This value must be "foos".'
                };
            };
            return true;
        }
    }
});
```

Check it out the live demo: http://fernandoperigolo.github.io/shall-not-pass/