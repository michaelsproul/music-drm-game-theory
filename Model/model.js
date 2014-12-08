// Independent parameters.
var a_album = 100;
var sigma_album = 2.8;

var alpha_album = 0.1;

var a_concert = 150;
var sigma_concert = 1.0;
var z = 0.05;
var alpha_concert = 0.74;

// Album -> Concert price multiplier.
var k = 3.4;

// Number of artists.
var n = 500;

// Number of firms.
var m = 4;

// DRM cost.
var rho = 5 * n;

// Demand increase due to the introduction of perfect DRM.
var psi = 1.7;

// Effectives of DRM.
var epsilon = 0.0;

// Demand decrease due to consumer rejection of DRM.
var gamma = 0.0;

function album_demand_fancy(price, delta) {
    var numerator = a_album - sigma_album * price;
    var denominator = 1 + delta * (gamma - psi * epsilon);
    return numerator / denominator;
}

function album_demand(price, delta) {
    return a_album - sigma_album * price + delta * (psi * epsilon - gamma);
}

function concert_demand_fancy(price, delta) {
    var numerator = a_concert - sigma_concert * k * price;
    var denominator = 1 + delta * z;
    return numerator / denominator;
}

function concert_demand(price, delta) {
    return a_concert - sigma_concert * k * price + delta * z;
}

function firm_payoff(num_artists, price, delta) {
    var album_profit = album_demand(price, delta) * (1 - alpha_album) * price;
    var concert_profit = concert_demand(price, delta) * (1 - alpha_concert) * k * price;
    var profit = num_artists * (album_profit + concert_profit);
    var drm_cost = delta * (rho / (num_artists + 1));
    return profit - drm_cost;
}

function artist_payoff(price, delta) {
    var album_profit = album_demand(price, delta) * alpha_album * price;
    var concert_profit = concert_demand(price, delta) * alpha_concert * k * price;
    return album_profit + concert_profit;
}

function print_state(delta, num_artists) {
    console.log(JSON.stringify(delta), JSON.stringify(num_artists));
}

// Return a random integer between min (included) and max (excluded).
function rand_int(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function solve() {
    // Starting from some set of initial conditions, evolve the system until an equilibrium is reached.
    var price = (alpha_album * a_album + alpha_concert * a_concert) / (2 * (sigma_album + k * sigma_concert));

    var delta = [true, true, true, true];
    var num_artists = [0, 0, 0, 0];
    var pairings = {};

    for (var i = 0; i < n; i++) {
        //var firm = Math.floor(4 * i / n);
        var firm = rand_int(0, 4);
        num_artists[firm]++;
        pairings[i] = firm;
    }

    for (var t = 0; t < 3; t++) {
        console.log("players just moved:");
        print_state(delta, num_artists);

        // Allow firms to deviate.
        for (var j = 0; j < m; j++) {
            var current_payoff = firm_payoff(num_artists[j], price, delta[j]);
            var alt_payoff = firm_payoff(num_artists[j], price, !delta[j]);

            if (alt_payoff > current_payoff) {
                delta[j] = !delta[j];
            }
        }

        console.log("firms just moved:");
        print_state(delta, num_artists);

        // Allow artists to deviate.
        for (var i = 0; i < n; i++) {
            var best_firm = pairings[i];
            var best_payoff = artist_payoff(price, delta[best_firm]);

            for (var j = 0; j < m; j++) {
                var payoff = artist_payoff(price, delta[j]);

                if (payoff > best_payoff) {
                    best_payoff = payoff;
                    best_firm = j;
                }
            }

            var old_firm = pairings[i];
            if (best_firm != old_firm) {
                pairings[i] = best_firm;
                num_artists[best_firm]++;
                num_artists[old_firm]--;
            }
        }
    }

    return delta;
}

