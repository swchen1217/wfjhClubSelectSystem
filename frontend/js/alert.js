/*const ALART_PRIMARY = 'alert-primary';
const ALART_SUCCESS = 'alert-success';
const ALART_DANGER = 'alert-danger';
const ALART_WARNING = 'alert-warning';
const ALART_INFO = 'alert-info';*/

function HideAlert() {
    $('#alert-primary').hide();
    $('#alert-success').hide();
    $('#alert-danger').hide();
    $('#alert-warning').hide();
    $('#alert-info').hide();

    $('#alert-success-in').text('');
    $('#alert-danger-in').text('');
    $('#alert-warning-in').text('');
    $('#alert-info-in').text('');
}

function ShowAlart(level, Content, isHTML, isFadeIn) {
    if (level != 'alert-primary') {
        if (isHTML) {
            $('#' + level + '-in').html(Content);
        } else {
            $('#' + level + '-in').text(Content);
        }
        if (isFadeIn) {
            $('#' + level).fadeIn();
        } else {
            $('#' + level).show();
        }
    } else {
        if (isHTML) {
            $('#alert-primary').html(Content);
        } else {
            $('#alert-primary').text(Content);
        }
        if (isFadeIn) {
            $('#alert-primary').fadeIn();
        } else {
            $('#alert-primary').show();
        }
    }
}