if (Meteor.isClient) {
  Messages = new Mongo.Collection("messages");
  Meteor.subscribe('messages');
  Template.board.helpers({
    currentText: function(){
      setTimeout(function(){emojify.run();}, 500);
      return Messages.findOne({}, {sort: {timestamp: -1}}).text;
    },
  });
  
  Template.board.events({
    'click button': function(){
      var content = $('input').val();
      Meteor.call('addMessage', content);
      $('input').val('');
    }
  });

  var query = Messages.find({}, {sort: {timestamp: -1}});
  var handle = query.observeChanges({
    added: function(){
      $('img').remove();
    }
  });
}

if (Meteor.isServer) {
  Messages = new Mongo.Collection("messages");

  Meteor.publish('messages', function(){
    Messages.find({}, {sort: {timestamp: -1}});
  });

  Meteor.methods({
    addMessage: function(text){
      Messages.insert({text: text, timestamp: Date.now()});
    }
  });
}
