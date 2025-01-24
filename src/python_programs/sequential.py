
def search(x, seq):
    count = 0
    for e in seq:
        if x > e:
            count += 1
    return count
