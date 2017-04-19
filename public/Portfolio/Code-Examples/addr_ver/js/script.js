"use strict";

(function () {

    window.onload = function() {
        create_form();

        $('button:first').on('click', function() {
            check_addr()
        })
    
    }


    function create_form () {
        $('<span><label>Street</label><input required></input></span><br/>').appendTo('section')
        $('<span><label>City</label><input required></input></span><br/>').appendTo('section')        
        $('<span><label>State</label><input required style="width:2em"></input></span>').appendTo('section')
        $('<span><label>Zip</label><input required style="width:5em"></input></span><br/>').appendTo('section')
        $('<button>Check</button>').appendTo('section')
        $('<button>Reset</button><br/>').appendTo('section')
    }

    function check_addr () {
        var addr = get_addr()
        var xml_string = create_string(addr)
        console.log(addr)
        console.log(xml_string)
        jQuery.ajax({
            type: "GET",
            url: 'http://production.shippingapis.com/ShippingAPI.dll?API=Verify&XML=' + xml_string,
            dataType: "xml",
            success: function (response) {
                console.log(response);
                var xml = response.documentElement
                address_check(xml)
      },
      error: function (xhr, ajaxOptions, err) {
        console.log(err);
      }
        })
    }

    function get_addr() {
        var addr = []
        $('input').each(function() {
            addr.push($(this).val())
        })
        return addr    
    }

    function create_string (addr) {
        var xml_string = ''
        xml_string = '<AddressValidateRequest USERID="456SHUEI4334">'
        xml_string = xml_string + '<IncludeOptionalElements>true</IncludeOptionalElements>'
        xml_string = xml_string + '<ReturnCarrierRoute>true</ReturnCarrierRoute>'
        xml_string = xml_string + '<Address ID="0">'  
        xml_string = xml_string + '<FirmName />'   
        xml_string = xml_string + '<Address1 />'   
        xml_string = xml_string + '<Address2>' + addr[0] +'</Address2>'   
        xml_string = xml_string + '<City>'+ addr[1] +'</City>'   
        xml_string = xml_string + '<State>' + addr[2] +'</State>'   
        xml_string = xml_string + '<Zip5>' + addr[3] + '</Zip5>'   
        xml_string = xml_string + '<Zip4></Zip4>' 
        xml_string = xml_string + '</Address>'      
        xml_string = xml_string + '</AddressValidateRequest>'
        return xml_string
    }

    function address_check (xml) {
        $('#newaddr').remove()
        if (xml.children[0].children[0].tagName != 'Error') {
            $('<div id="newaddr"><div>').appendTo('section')
            $('<p></p>').text(xml.children[0].children[0].innerHTML).appendTo('#newaddr')
            $('<p></p>').text(xml.children[0].children[1].innerHTML).appendTo('#newaddr')
            $('<p></p>').text(xml.children[0].children[2].innerHTML).appendTo('#newaddr')
            $('<p></p>').text(xml.children[0].children[3].innerHTML).appendTo('#newaddr')
        } else {
            alert(xml.children[0].children[0].children[2].innerHTML)
            }
    }

})()