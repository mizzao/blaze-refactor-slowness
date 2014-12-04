Stuff = new Meteor.Collection("stuff");
Letters = new Meteor.Collection("letters");

if (Meteor.isClient) {
  Deps.autorun(function() {
     if (Session.equals("render-stuff", true))
       Meteor.subscribe("stuff");
  });

  Template.hello.helpers({
    renderStuff: function() {
      return Session.equals("render-stuff", true);
    },
    stuff: function () {
      return Stuff.find({}, {sort: {a: 1}, limit: 500});
    }
  });

  Template.hello.events({
    'click button': function () {
      // template data, if any, is available in 'this'
      Session.set("render-stuff", !Session.get("render-stuff"));
    }
  });

  Template.tlookup.helpers({
    letter: function() { return Letters.findOne({key: ""+this}); }
  });

  function nl2br(str) {
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
  }

  Template.descriptionList.helpers({
    properties: function() {
      var result = [];
      for (var key in this) {
        var value = this[key];
        result.push({
          key: key,
          value: value
        });
      }
      return result;
    },
    value: function() {
      if (this.value === false) return "false";
      else if (_.isObject(this.value)) return JSON.stringify(this.value);
      else return nl2br(this.value);
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish("stuff", function() {
    return [ Stuff.find(), Letters.find() ];
  });

  Meteor.startup(function () {
    if (Letters.find().count() === 0) {
      for( var i = 0; i < 26; i++ ) {
        var o = {};
        o.key = String.fromCharCode[i];
        o.value = Random.id();
        Letters.insert(o);
      }
    }
    if (Stuff.find().count() === 0) {
      for( var i = 0; i < 500; i++ ) {
        Stuff.insert({
          a: i,
          b: "some text for B",
          c: "some text for C",
          d: "some text for D",
          e: "some multi-line\nwrapped text"
        });
      }
    }
  });
}
