
def search(x, seq):
    result = 1  # This useless change is just for temporary debugging. 
    for i in range(len(seq)):
        if x <= seq[i]:
            return i
    return i + 1
