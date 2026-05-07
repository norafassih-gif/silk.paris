// SILK PARIS — Réservations → Google Calendar
// Ce script lit les emails FormSubmit et crée des événements dans Google Calendar.

function checkReservations() {
  var label = getOrCreateLabel('Réservation-Traitée');
  var threads = GmailApp.search('from:noreply@formsubmit.co is:unread');

  if (threads.length === 0) return;

  var calendar = CalendarApp.getDefaultCalendar();

  threads.forEach(function(thread) {
    thread.getMessages().forEach(function(message) {
      if (!message.isUnread()) return;

      var body = message.getPlainBody();

      var nom      = extract(body, 'nom');
      var date     = extract(body, 'date');
      var heure    = extract(body, 'heure');
      var couverts = extract(body, 'couverts');
      var tel      = extract(body, 'telephone');

      if (!date || !heure) return;

      var dateParts  = date.split('-');
      var timeParts  = heure.split(':');
      var startDate  = new Date(
        parseInt(dateParts[0]),
        parseInt(dateParts[1]) - 1,
        parseInt(dateParts[2]),
        parseInt(timeParts[0]),
        parseInt(timeParts[1])
      );
      var endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2h par défaut

      var title = 'Réservation : ' + (nom || 'Client') + ' — ' + (couverts || '?') + ' pers.';
      var description = [
        'Nom : '       + (nom      || '-'),
        'Couverts : '  + (couverts || '-'),
        'Téléphone : ' + (tel      || '-'),
        'Heure : '     + heure
      ].join('\n');

      calendar.createEvent(title, startDate, endDate, { description: description });

      message.markRead();
      thread.addLabel(label);
    });
  });
}

function extract(body, field) {
  var regex = new RegExp(field + '\\s*[:\\|]\\s*(.+)', 'i');
  var match = body.match(regex);
  return match ? match[1].trim() : '';
}

function getOrCreateLabel(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}
