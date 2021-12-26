new Vue({
  el: '#events',

  data: {
    event: { id: 0, title: '', category: '', detail: '', date: '' },
    events: []
  },

  ready: function () {
    this.fetchEvents();
  },

  methods: {

    fetchEvents: function () {
      var events = [];
      this.$http.get('/api/connection');
      this.$http.get('/api/events')
        .success(function (events) {
          this.$set('events', events);
          // console.log(events);
        })
        .error(function (err) {
          console.log(err);
        });
    },

    addEvent: function () {
      if (this.event.title.trim() && this.event.category.trim() && this.event.date.trim()) {
        this.$http.post('/api/events', this.event)
          .success(function (res) {
            console.log(res.insertId);
            this.events.push({ id: res.insertId, title: this.event.title, category: this.event.category, detail: this.event.detail, date: this.event.date});
            console.log('Event added!');
          })
          .error(function (err) {
            console.log(err);
          });
      }
    },

    deleteEvent: function (id) {
      if (confirm('Are you sure you want to delete this event?')) {
        console.log(id);
        this.$http.delete('api/events/' + id)
          .success(function (res) {
            console.log(res);
            var index = this.events.indexOf(this.events.find(x => x.id === id));
            this.events.splice(index, 1);
          })
          .error(function (err) {
            console.log(err);
          });
      }
    }
  }
});

Vue.filter('formatDate', function (value) {
  if (value) {
    var date = new Date(value);
    return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
  }
})