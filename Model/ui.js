function setUpTangle () {
    var tangle = new Tangle(document, {
        initialize: function () {
            this.n = 500;
            this.m = 4;
            this.gamma = 0.5 * 100;
            this.epsilon = 0.5 * 100;
        },
        update: function () {
            // Set model parameters globally.
            n = this.n;
            m = this.m;
            epsilon = this.epsilon / 100;
            this.solution = solve();
        }
    });
}

Tangle.formats.twoDigit = function(value) {
    return value.toString() + "%";
}
