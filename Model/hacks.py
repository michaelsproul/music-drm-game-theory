from math import sqrt, ceil

alpha_a = 0.1
alpha_t = 0.74

theta = 0.05
psi = 1.7
gamma = 0.1

a_a = 100
a_t = 150

k = 1.8

sigma_a = 4
sigma_t = 4

c_a = 2
c_t = 2

rho = 1000

def album_payoff(alpha, price):
    return (a_a - sigma_a * price) * alpha * price

def ticket_payoff(alpha, price):
    return (a_t - k * sigma_t * price) * k * alpha * price

def artist_payoff(price):
    return album_payoff(alpha_a, price) + ticket_payoff(alpha_t, price) - c_a - c_t

def price():
    numerator = alpha_a * a_a + k * alpha_t * a_t
    denominator = 2 * (alpha_a * sigma_a + k * alpha_t * sigma_t)
    return numerator / denominator

def epsilon():
    pr = price()
    body = (theta * album_payoff(alpha_a, pr)) / ticket_payoff(alpha_t, pr) + gamma
    return body / psi

def eta():
    pr = price()
    x = (psi * epsilon() - gamma) * album_payoff(1 - alpha_a, pr)
    y = theta * ticket_payoff(1 - alpha_t, pr)
    X = rho / (x - y)
    print("X is {}", X)
    e = ceil((-1 + sqrt(1 + 4 * X)) / 2)
    return e
