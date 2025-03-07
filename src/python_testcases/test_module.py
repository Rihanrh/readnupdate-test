import pytest # type: ignore
from python_programs.sequential import search
from python_programs.duplicate import remove_extras

def test_search():
    assert search(42, (-5, 1, 3, 5, 7, 10)) == 6
    assert search(42, [1, 5, 10]) == 3
    assert search(5, (1, 5, 10)) == 1
    assert search(7, [1, 5, 10]) == 2
    assert search(3, (1, 5, 10)) == 1
    assert search(-5, (1, 5, 10)) == 0
    assert search(10, (-5, -1, 3, 5, 7, 10)) == 5
    assert search(-100, (-5, -1, 3, 5, 7, 10)) == 0
    assert search(0, (-5, -1, 3, 5, 7, 10)) == 2
    assert search(100, []) == 0
    assert search(-100, ()) == 0

def test_duplicate():
    assert remove_extras([1, 1, 1, 2, 3]) == [1, 2, 3]
    assert remove_extras([1, 5, 1, 1, 3, 2]) == [1, 5, 3, 2]
    assert remove_extras([]) == []
    assert remove_extras([3, 4, 5, 1, 3]) == [3, 4, 5, 1]
