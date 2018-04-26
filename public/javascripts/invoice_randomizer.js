console.log('loaded');
$(function () {
    var FONT_FAMILIES = ['Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Avant Garde', 'Calibri',
                         'Candara', 'Century Gothic', 'Franklin Gothic Medium', 'Futura', 'Geneva', 'Gill Sans',
                         'Helvetica', 'Impact', 'Lucida Grande', 'Optima', 'Segoe UI', 'Tahoma', 'Trebuchet MS',
                         'Verdana', 'Big Caslon', 'Bodoni MT', 'Book Antiqua', 'Calisto MT', 'Cambria', 'Didot',
                         'Garamond', 'Georgia', 'Goudy Old Style', 'Hoefler Text', 'Lucida Bright', 'Palatino',
                         'Perpetua', 'Rockwell', 'Rockwell Extra Bold', 'Baskerville', 'Times New Roman', 'Consolas',
                         'Courier New', 'Lucida Console', 'Lucida Sans Typewriter', 'Monaco', 'Andale Mono',
                         'Copperplate', 'Papyrus', 'Brush Script MT'];
    console.log('invoice_randomizer');

    function tabulateTable(invoice) {
        var useTerm = Math.random() < 0.5;
        var termText = Math.random() < 0.5;
        var $table = $(
            '<table id="main_invoice_summary">' +
            '<thead>' +
            '<tr>' +
            '<th>Invoice ' + chance.pickone(['Number', 'No.', '#']) + '</th>' +
            '<th>Invoice Date</th>' +
            (useTerm ? '<th>' + (Math.random() < 0.5 ? 'Payment ' : '') + 'Terms </th>' : '') +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td>' + invoice.number + '</td>' +
            '<td>' + invoice.date + '</td>' +
            (useTerm
             ? '<td>' + (termText ? 'Net ' : '') + invoice.terms + (termText ? ' Days' : '') + '</td>'
             : '')
            +
            '</tbody>' +
            '</table>'
            )
        ;
        return $table;
    }

    function genSideBySideTable(invoice, totalSum, currency) {
        var $div = $('<div>').addClass('side_by_side_table');
        var $table1 = $(
            '<table id="table1">' +
            '<thead>' +
            '<tr>' +
            '<th>Invoice ' + chance.pickone(['Number', 'No.', '#']) + '</th>' +
            '<th>Invoice Date</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td>' + invoice.number + '</td>' +
            '<td>' + invoice.date + '</td>' +
            '</tbody>' +
            '</table>');
        $table1.transpose({mode: 0});
        var termText = Math.random() < 0.5;
        var $table2 = $(
            '<table id="table2">' +
            '<thead>' +
            '<tr>' +
            '<th>Payment Terms</th>' +
            '<th>Total Due</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr>' +
            '<td>' + (termText ? 'Net ' : '') + invoice.terms + (termText ? ' Days' : '') + '</td>' +
            '<td>' + currency + ' ' + totalSum.toFixed(2) + '</td>' +
            '</tbody>' +
            '</table>');
        $table2.transpose({mode: 0});
        $div.append($table1, $table2);
        return $div;
    }

    function generateToBlock(toCompany, toPerson) {
        var attn = toPerson.position;
        if (Math.random() < 0.5) {
            attn = toPerson.name + ', ' + attn;
        }
        var address = [toCompany.city, toCompany.state, toCompany.zip];
        var $div = $(
            '<div id="main_invoice_to"><div class="content">' +
            'ATTN: ' + attn + '<br/>' +
            toCompany.name + '<br/>' +
            toCompany.address + '<br/>' +
            address.join(chance.pickone(',', '') + ' ') +
            '</div></div>');
        if (Math.random() < 0.5) {
            var label = chance.pickone(['Bill To:', 'Invoice To:', 'Invoice']);
            if (Math.random() < 0.5) label = label.toLocaleUpperCase();
            $div.prepend('<div class="label">' + label + '</div>');
            $div.find('.label').css({
                'margin-bottom': chance.floating({min: 0, max: 0.8}) + 'em'

            })
        }
        return $div;
    }

    function generateFromBlock(fromCompany, fromPerson) {
        var address = [fromCompany.city, fromCompany.state, fromCompany.zip];
        var $div = $(
            '<div id="main_invoice_from">' +
            '<span class="company-name">' + fromCompany.name + '</span><br/>' +
            fromCompany.address + '<br/>' +
            address.join(chance.pickone(',', '') + ' ') +
            '</div>');
        if (Math.random() < 0.5) {
            var contact = ['Tel: ' + fromCompany.phone, 'Fax: ' + fromCompany.fax];
            var mail = ['Email: ' + fromCompany.email, 'Website: ' + fromCompany.website];
            if (Math.random() < 0.5) $div.append();
            $div.append('<br/>' + contact.join(chance.pickone(' ', ' - ', ' ~ ', ' • ')));
            $div.append('<br/>' + mail.join(chance.pickone(' ', ' - ', ' ~ ', ' • ', '<br/>')))
        }
        return $div;
    }

    function randomizeTableStyle($table, transpose) {
        $table.transpose({mode: 0});
        if ((typeof transpose == 'undefined' && Math.random() < 0.5)
            || transpose === true) {
            $table.transpose('transpose');
        }
        var headerWeight = chance.pickone(['bold', 'bolder', 'lighter', 'normal']);
        $table.find('th').css({
            'vertical-align': chance.pickone(['top', 'middle']),
            'text-align'    : chance.pickone(['center', 'left', 'right', 'justify']),
            'font-weight'   : headerWeight + '!important'
        });
        $table.find('td').css({
            'vertical-align': chance.pickone(['top', 'middle']),
            'text-align'    : chance.pickone(['center', 'left', 'right', 'justify']),
            'font-weight'   : headerWeight.indexOf('bold') == -1
                              ? chance.pickone(['lighter', 'normal'])
                              : chance.pickone(['center', 'left', 'right', 'justify'])
        });
        $table.css({
            'width': chance.integer({min: 150, max: 500}) + 'px'
        });
        $table.find('th, td')
              .css({
                  'padding'     : chance.floating({min: 0, max: 0.5}) + 'em '
                                  + chance.floating({min: 0, max: 1}) + 'em',
                  'line-height' : chance.floating({min: 0.9, max: 1.5}) + 'em',
                  'word-spacing': Math.random() < 0.5 ? chance.floating({min: 0, max: 0.5}) + 'em' : 0
              })
              .addBack().css({
            'border': chance.integer({
                min: 0,
                max: 3
            }) + 'px solid black'
        });
    }

    function generateSimpleInvoices(taxRate, currency) {
        var amtTxt = chance.pickone(['Amount', 'Amt']);
        var $table = $('<table>').attr('id', 'items');
        var useCurrency = Math.random() < 0.5;

    }

    function generateGuestInvoiceTable(taxRate, currency) {
        var amtTxt = chance.pickone(['Amount', 'Amt']);
        var $table = $('<table>').attr('id', 'items').addClass('horizontal');
        var $thead = $('<thead>' +
                       '<tr>' +

                       '</tr>'
        ).appendTo($table);
    }

    function generateItemInvoiceTable(taxRate, currency) {
        var amtTxt = chance.pickone(['Amount', 'Amt']);
        var $table = $('<table>').attr('id', 'items');
        var multiline = Math.random() < 0.5;
        var useCurrency = Math.random() < 0.5;
        var itemHeader = ['Item'];
        if (multiline) {
            itemHeader = itemHeader.concat([
                'Model Number',
                'Serial Number',
                'Reference Number'
            ]);
        }
        var $thead = $(
            '<thead>' +
            '<tr>' +
            '<th>' + itemHeader.join('<br/>') + '</th>' +
            '<th>Description</th>' +
            '<th>' + chance.pickone(['Qty', 'Quantity']) + '</th>' +
            '<th>' + chance.pickone(['Rate', 'Price / Unit']) + '</th>' +
            '<th>Charge ' + amtTxt + '</th>' +
            '<th>Tax ' + amtTxt + '</th>' +
            '<th>Total Due</th>' +
            '</tr>' +
            '</thead>'
        ).appendTo($table);
        var $tbody = $('<tbody>').appendTo($table);
        var itemCount = chance.integer({min: 1, max: 100});
        var grandTotalQty = 0;
        var grandTotalCharged = 0;
        var grandTotalTaxed = 0;
        var grandTotal = 0;
        for (var i = 0; i < itemCount; i++) {
            var $row = $('<tr>').appendTo($tbody);
            var item = generateSingleItem();
            var itemName = [item.name];
            if (multiline) {
                itemName = itemName.concat([chance.cf(), chance.ssn(), chance.cpf()]);
            }
            $row.append('<td>' + itemName.join('</br>') + '</td>');
            $row.append('<td>' + item.desc + '</td>');
            $row.append('<td>' + item.qty + '</td>');
            $row.append('<td>' + (useCurrency ? currency + ' ' : '') + item.price + '</td>');
            var totalCharged = item.qty * item.price;
            var tax = totalCharged * taxRate;
            $row.append('<td>' + (useCurrency ? currency + ' ' : '') + (totalCharged).toFixed(2) + '</td>');
            $row.append('<td>' + (useCurrency ? currency + ' ' : '') + (tax).toFixed(2) + '</td>');
            $row.append('<td>' + (useCurrency ? currency + ' ' : '') + (totalCharged + tax).toFixed(2) + '</td>');
            grandTotalQty += item.qty;
            grandTotalCharged += totalCharged;
            grandTotalTaxed += tax;
            grandTotal += (totalCharged + tax);
        }
        var $tfoot = $('<tfoot>').appendTo($table);
        var paid = 0;
        if (Math.random() < 0.5) {
            $(
                '<tr>' +
                '<td></td>' +
                '<td></td>' +
                '<td>' + grandTotalQty.toFixed(2) + '</td>' +
                '<td></td>' +
                '<td>' + (useCurrency ? currency + ' ' : '') + grandTotalCharged.toFixed(2) + '</td>' +
                '<td>' + (useCurrency ? currency + ' ' : '') + grandTotalTaxed.toFixed(2) + '</td>' +
                '<td>' + (useCurrency ? currency + ' ' : '') + grandTotal.toFixed(2) + '</td>' +
                '</tr>'
            ).appendTo($tfoot);
        } else {
            paid = chance.floating({min: 0, max: 0.3}) * grandTotal;
            var firstSpan = chance.integer({min: 2, max: 5});
            var secondSpan = $thead.find('th').length - 1 - firstSpan;
            $('<tr>' +
              '<td rowspan="3" colspan="' + firstSpan + '"></td>' +
              '<th colspan="' + secondSpan + '">Grand Total</th>' +
              '<td>' + (useCurrency ? currency + ' ' : '') + grandTotal.toFixed(2) + '</td>' +
              '</tr>').appendTo($tfoot);
            $('<tr>' +
              '<th colspan="' + secondSpan + '">' + chance.pickone(['Paid', 'Amount Paid', 'Amt Paid']) + '</th>' +
              '<td>' + (useCurrency ? currency + ' ' : '') + paid.toFixed(2) + '</td>' +
              '</tr>').appendTo($tfoot);
            $('<tr>' +
              '<th colspan="' + secondSpan + '">' + chance.pickone(
                    ['Due', 'Amount Due', 'Amt Due', 'Balance']) + '</th>' +
              '<td>' + (useCurrency ? currency + ' ' : '') + (grandTotal - paid).toFixed(2) + '</td>' +
              '</tr>').appendTo($tfoot);
        }

        return {
            tableElement: $table,
            grandTotal  : grandTotal,
            paid        : paid
        };
    }

    function generateSingleItem() {
        var addr = chance.address().split(' ');
        var qty = chance.integer({min: 1, max: 10});
        var itemPrc = chance.floating({min: 10, max: 500, fixed: 2});
        return {
            name : addr[1],
            desc : generateItemDesc(addr[1]),
            qty  : qty,
            price: itemPrc
        };
    }

    function generateItemDesc(itemName) {
        var shape = chance.pickone(['Round', 'Square', 'Rectangular', 'Oval']);
        var color = chance.pickone(['red', 'blue', 'yellow', 'dark', 'green', 'orange', 'purple', 'pink']);
        var action = chance.pickone(['made', 'carved', 'extracted']);
        var material = chance.pickone(['paper', 'metal', 'plastic', 'glass']);
        var randText = chance.sentence();
        var words = [shape, itemName, action, chance.pickone(['from', 'of', 'by']), material, 'in', color];
        return words.join(' ') + '.' + chance.pickone(
            [' ', '<br/>', '<br/><br/>']) + (Math.random() < 0.5 ? randText + '.' : '');
    }

    function generateContact(fromCompany) {
        var opt = chance.integer({min: 0, max: 3});
        var $div = $('<div>');
        switch (0) {
            case 0:
                var $label = $('<div class="label">'
                               + chance.pickone(['Invoice', 'Have', ''])
                               + ' '
                               + chance.pickone(['Question', 'Questions', 'Query', 'Queries'])
                               + chance.pickone(['?', '']) + '</div>');
                $div.append($label);
                var $contact = $('<div class="contact">'
                                 + '<br/>Contact '
                                 + chance.pickone(['us ', fromCompany.name + ' ', ''])
                                 + chance.pickone(['at', '@'])
                                 + '</div>');
                var contact = ['Tel: ' + fromCompany.phone, 'Fax: ' + fromCompany.fax];
                var mail = ['Email: ' + fromCompany.email, 'Website: ' + fromCompany.website];
                if (Math.random() < 0.5) {
                    contact = contact.concat(mail);
                }
                $div.append(' ' + contact.join(chance.pickone(' ', ' - ', ' ~ ', ' • ')));
                break;
        }
        return $div;
    }

    function generatePaymentCheckboxes() {
        var $div = $('<div>').attr('id', 'payment_method');
        if (Math.random() < 0.5) {
            var headingSize = chance.integer({min: 3, max: 6});
            $div.append(
                '<h' + headingSize + ' class="label">'
                + chance.pickone(['Payment', 'Payment Method', 'Remittance'])
                + '</h' + headingSize + '>');
        }
        var $ul = $('<ul>').attr('id', 'payment_method_list').css('list-style', 'none').appendTo($div);
        var ccAvailables = chance.n(chance.cc_type, chance.integer({min: 2, max: 5}));
        var allCaps = Math.random() < 0.5;
        for (var i = 0; i < ccAvailables.length; i++) {
            var $li = $('<li>').appendTo($ul);
            $('<input>').attr({
                type: 'checkbox'
            }).appendTo($li);
            $li.append(' ' + (allCaps ? ccAvailables[i].toLocaleUpperCase() : ccAvailables[i]));
        }
        return $div;
    }

    function generateRemittanceInfo(fromCompany, total, currency) {
        var $div = $('<div>').attr('id', 'remittance-detail');
        if (Math.random() < 0.5) {
            var remittanceKeyword = chance.pickone(['remit', 'transfer', 'pay']);
            if (Math.random() < 0.5) remittanceKeyword = remittanceKeyword.toLocaleUpperCase();
            var paymentContext = chance.pickone(['your', 'the']) + ' <span class="highlight">payments only</span>';
            if (Math.random() < 0.5) paymentContext = '<span>' + currency + ' ' + total.toFixed(2) + '</span>';
            $div.append('Please ' + remittanceKeyword + ' ' + paymentContext + ' to:');
        } else {
            $div.append('<span class="highlight">'
                        + chance.pickone(['Electronic Transfer', 'Remittance', 'Bank Transfer', 'Payment'])
                        + ' Instruction</span>');
        }
        if (Math.random() < 0.5) {
            $div.append('<br/>' + fromCompany.address);
            $div.append('<br/>' + [fromCompany.city, fromCompany.state, fromCompany.zip]
                .join(chance.pickone([',', ' '])));
        } else {
            var $table = $('<table>').attr('id', 'remittance_info_table').appendTo($('body'));
            var accText = chance.pickone(['Account', 'Acc.']);
            var withNote = Math.random() < 0.5;
            var remarksText = 'Please ensure '
                              + chance.pickone(['all information', 'customer name, number', 'invoice number'])
                              + ' are included during the ' +
                              +chance.pickone(['Electronic Transfer', 'Remittance', 'Bank Transfer', 'Payment']);
            $table.append($('<thead>'
                            + '<tr>'
                            + '<th>' + accText + ' Name</th>'
                            + '<th>' + accText + ' Number</th>'
                            + (withNote ? '<th class="remarks">' + chance.pickone(
                    ['Important', 'Note', 'Remark']) + '</th>' : '')
                            + '</tr>'
                            + '</thead>'));
            $table.append($('<tbody>'
                            + '<tr>'
                            + '<td>' + fromCompany.name + '</td>'
                            + '<td>' + fromCompany.bank_account + '</td>'
                            + (withNote ? '<td>' + remarksText + '</td>' : '')
                            + '</tr>'
                            + '</tbody>'));
            $table.transpose({mode: 0});
            $table.transpose('transpose');
            $table.appendTo($div);
        }

        return $div;
    }

    function printDoc() {
        var $toPrint = $('#container');
        var printWindow = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        printWindow.document.write($toPrint[0].innerHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }

    chance.mixin({
        full_company : function () {
            var compNm = chance.company();
            var domain = compNm.split(' ')[0].toLocaleLowerCase() + '.' + chance.tld();
            return {
                name        : compNm,
                address     : chance.address({short_suffix: Math.random() < 0.5}),
                city        : chance.city(),
                state       : chance.state({full: Math.random() < 0.5}),
                zip         : chance.zip({plusfour: Math.random() < 0.5}),
                phone       : chance.phone(),
                fax         : chance.phone(),
                email       : chance.email({domain: domain}),
                website     : 'www.' + domain,
                bank_account: chance.cc()
            }
        },
        full_person  : function () {
            return {
                name    : chance.name({middle: Math.random() < 0.5}),
                position: chance.profession({rank: Math.random() < 0.5}),
                email   : chance.email(),
                phone   : chance.phone({formatted: Math.random() < 0.5, mobile: Math.random() < 0.5}),
                fax     : chance.phone()
            }
        },
        invoice_basic: function () {
            return {
                number: chance.ssn({dashes: false}),
                date  : chance.date({string: true, american: false, year: 2018}),
                terms : chance.integer({min: 3, max: 20})
            }
        }
    });

    function generateInvoice() {
        var currency = chance.pickone(['$', '¥', '€', '£']);
        var taxRate = chance.floating({min: 0, max: 0.17});

        var invoice = chance.invoice_basic();
        var fromCompany = chance.full_company();
        var fromPerson = chance.full_person();
        var toCompany = chance.full_company();
        var toPerson = chance.full_person();

        var $header = $('header').empty();
        var $footer = $('footer').empty();
        var $result = $('#result').empty();

        var $fromBlock = generateFromBlock(fromCompany, fromPerson);
        $fromBlock.css({
            'text-align' : chance.pickone(['left', 'center']),
            'font-weight': chance.pickone(['bold', 'bolder', 'normal']),
            'margin'     : chance.floating({
                min: 0.5,
                max: 1.2
            }) + 'em '
                           + chance.floating({
                min: 0.5,
                max: 1.2
            }) + 'em'
        });
        $header.append($fromBlock);
        if (Math.random() < 0.5) {
            $.ajax({
                url    : '/icon',
                data   : {
                    companyName: fromCompany.name
                },
                success: function (res) {
                    var $img = $('<img src="' + res + '">');
                    $img.css({
                        height     : $fromBlock.height() + 'px',
                        'max-width': $fromBlock.width()
                    });
                    $fromBlock.prepend('<br/>');
                    $fromBlock.prepend($img);
                },
                async  : false
            });
            $fromBlock.addClass('icon-done');
        } else {
            $fromBlock.addClass('icon-done');
        }

        var $toBlock = generateToBlock(toCompany, toPerson);
        $toBlock.css({
            'margin': chance.floating({
                min: 0.5,
                max: 1.2
            }) + 'em '
                      + chance.floating({
                min: 0.5,
                max: 1.2
            }) + 'em'
        });
        $result.append($toBlock);

        var $invoiceTable = tabulateTable(invoice);
        $result.append($invoiceTable);
        randomizeTableStyle($invoiceTable);

        if ($fromBlock.css('text-align') == 'left') {
            $fromBlock.css('display', 'inline-block');
            if ($invoiceTable.find('.tp_rows').length > 0) {
                $invoiceTable.css({
                    float       : 'right',
                    'max-width' : $result.width() - $fromBlock.outerWidth(true),
                    'margin-top': $fromBlock.css('margin-top')
                });
                $invoiceTable.insertAfter($fromBlock);
            }
        } else {
            if ($invoiceTable.find('.tp_rows').length > 0) {
                $toBlock.css('display', 'inline-block');
                $invoiceTable.css({
                    float       : 'right',
                    'max-width' : $result.width() - $toBlock.outerWidth(true),
                    'margin-top': $toBlock.css('margin-top')
                });
            }
        }

        var invoiceItems = generateItemInvoiceTable(taxRate, currency);

        var $sideBySideTableCont = genSideBySideTable(invoice, invoiceItems.grandTotal - invoiceItems.paid, currency);
        $result.append($sideBySideTableCont);
        var $sideBySideTables = $sideBySideTableCont.find('table');
        randomizeTableStyle($sideBySideTables, true);
        $sideBySideTableCont.css({
            'text-align': chance.pickone(['center', 'left', 'right'])
        });
        $sideBySideTables.css({
            width        : 'auto',
            'margin-top' : chance.floating({min: 0.5, max: 2}) + 'em',
            'margin-left': chance.floating({min: 0, max: 1}) + 'em'
        });

        var $paymentContainer = $('<div id="payment_container"></div>');
        $result.append($paymentContainer);
        if (Math.random() < 0.5) {
            var $remittanceInfo = generateRemittanceInfo(fromCompany, invoiceItems.grandTotal - invoiceItems.paid,
                currency);
            $paymentContainer.append($remittanceInfo);
            $remittanceInfo.css({
                'float': chance.pickone(['right', 'none']),
                margin : chance.floating({min: 0, max: 1}) + 'em ' + chance.floating({min: 0, max: 1}) + 'em'
            });
            $remittanceInfo.find('.highlight').css({
                'text-decoration': chance.pickone(['underline', 'none']),
                'font-size'      : chance.floating({min: 1, max: 1.5}) + 'em',
                'font-weight'    : chance.pickone(['bolder', 'bolder', 'normal']),
                'font-style'     : chance.pickone(['italic', 'none'])
            }).each(function () {
                if (Math.random() < 0.5) {
                    $(this).text(Math.random() < 0.5
                                 ? $(this).text().toLocaleLowerCase()
                                 : $(this).text().toLocaleUpperCase());
                }
            });
        }
        if (Math.random() < 0.5) {
            var $paymentCheckBoxesDiv = generatePaymentCheckboxes();
            $paymentContainer.append($paymentCheckBoxesDiv);
            $paymentCheckBoxesDiv.css('width', 'fit-content');
            $paymentCheckBoxesDiv.css({
                'float': chance.pickone(['right', 'none']),
                margin : chance.floating({min: -1, max: 1}) + 'em ' + chance.floating({min: 0, max: 1}) + 'em'
            });
            $paymentCheckBoxesDiv.find('.label').css({
                'text-decoration': chance.pickone(['initial', 'underline']),
                'text-align'     : chance.pickone(['left', 'center'])
            });
            $paymentCheckBoxesDiv.find('ul').css({
                'font-weight': chance.pickone(['bold', 'bolder', 'light']),
                'font-style' : chance.pickone(['italic', 'inherit']),
                'font-size'  : chance.floating({min: 0.8, max: 1.2}) + 'em'
            });
            $paymentCheckBoxesDiv.find('li').css({
                display: chance.pickone(['inline-block', 'block'])
            });
        }
        $paymentContainer.find('>div').css('display', 'inline-block');
        $('<div style="clear:both;"></div>').insertAfter($paymentContainer);


        $result.append(invoiceItems.tableElement);
        randomizeTableStyle(invoiceItems.tableElement, false);
        invoiceItems.tableElement.css({
            width       : 'auto',
            'margin-top': chance.floating({min: 0, max: 2}) + 'em'
        });


        var compNameFontSize = chance.floating({min: 1, max: 1.5});
        var otherRatio = chance.floating({min: 0.8, max: 1});
        $fromBlock.css({
            'font-size': (otherRatio * compNameFontSize) + 'em'
        });
        $fromBlock.find('.company-name').css({
            'font-size': (compNameFontSize / (otherRatio * compNameFontSize)) + 'em'
        });
        if (Math.random() < 0.5) {
            var seperatorCSS = {
                'border': [
                    chance.integer({min: 1, max: 3}) + 'px',
                    chance.pickone(['dashed', 'dotted', 'double', 'groove']),
                    'black'].join(' ')
            };
            $('<div>').css(seperatorCSS).insertBefore($('#items'));
            if ($paymentContainer.children().length > 0) {
                $('<div>').css(seperatorCSS).insertBefore($('#payment_container'));
            }

        }

        if (Math.random() < 0.5) {
            $('th').css({
                'background-color': chance.color() + '!important',
                'font-weight'     : chance.pickone(['bolder', 'bold', 'lighter', 'normal'])
            });
        }
        if (Math.random() < 0.5) {
            $('tr:even:not(.tp_rows)').css({'background-color': chance.color()});
        }
        if (Math.random() < 0.5) {
            $('tr:odd:not(.tp_rows)').css({'background-color': chance.color()});
        }

        $('#container').css({
            padding      : chance.floating({min: 2, max: 5}) + 'em',
            'padding-top': chance.floating({min: 0.8, max: 4}) + 'em'
        });
        $footer.append(generateContact(fromCompany));
        $footer.css({
            'text-align': chance.pickone(['left', 'center']),
            'font-size' : chance.floating({min: 0.5, max: 1}) + 'em'
        });
        $('body').css({
            'font-family' : chance.pickone(FONT_FAMILIES),
            'font-variant': chance.pickone(
                ['normal', 'titling-caps', 'proportional-width'])
        });
        $('#container div:not(:empty)').each(function () {
            if (Math.random() < 0.5) {
                $(this).css({
                    'font-family' : chance.pickone(FONT_FAMILIES),
                    'font-variant': chance.pickone(
                        ['normal', 'titling-caps', 'proportional-width'])
                });
            }
        });
        addRandomShifting();
    }

    function addRandomShifting() {
        $('#container table').each(function () {
            if (Math.random() < 0.5) return;
            $(this).find('tr td').each(function () {
                $(this).css({
                    'padding-left'  : chance.floating({min: 0, max: 3}) + 'em',
                    'padding-right' : chance.floating({min: 0, max: 3}) + 'em',
                    'padding-top'   : chance.floating({min: 0, max: 1.5}) + 'em',
                    'padding-bottom': chance.floating({min: 0, max: 1.5}) + 'em'
                })
            });
        });
        $('#container div:not(:has(table)):not(:empty)').each(function () {
            if (Math.random() < 0.5) $(this).css('letter-spacing', chance.floating({min: 0, max: 1}) + 'em');
            $(this).find('br').each(function () {
                if (Math.random() < 0.5) $(this).css('line-height', chance.floating({min: 1, max: 2}) + 'em');
            });
        });
    }

    $('#generate').click(generateInvoice);
    $('#generate').focus();
    generateInvoice();

    $(window).on('keydown', function (e) {
        if (e.ctrlKey && e.which == 80) printDoc();
    });
});
