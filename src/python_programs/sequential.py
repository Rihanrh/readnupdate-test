
def search(x, seq):
    for i in range(len(seq)):
        if x <= seq[i]:  # Change from '<' to '<=' for debugging purposes, original was incorrect
            return i
    return len(seq)  # Added return len(seq) for clarity if reaching end of list
