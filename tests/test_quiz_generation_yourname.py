"""
Unit tests for quiz generation user story.
Contributor: Shyam Thummar 
"""

import pytest

class QuizRequest:
    def __init__(self, file_content, difficulty, num_questions):
        self.file_content = file_content
        self.difficulty = difficulty
        self.num_questions = num_questions

def generate_quiz(quiz_request: QuizRequest):
    """
    Stubbed quiz generator used only for testing structure.
    Returns a dictionary with metadata fields expected by tests.
    """
    return {
        "difficulty": quiz_request.difficulty,
        "num_questions": quiz_request.num_questions,
        "questions": ["Q" + str(i) for i in range(quiz_request.num_questions)],
    }


def test_quiz_request_stores_parameters_shyam-thummar():
    req = QuizRequest("some content", "medium", 10)
    assert req.file_content == "some content"
    assert req.difficulty == "medium"
    assert req.num_questions == 10


def test_generate_quiz_returns_correct_count_shyam-thummar():
    req = QuizRequest("content", "easy", 5)
    quiz = generate_quiz(req)
    assert len(quiz["questions"]) == 5


def test_generate_quiz_preserves_difficulty_shyam-thummar():
    req = QuizRequest("content", "advanced", 15)
    quiz = generate_quiz(req)
    assert quiz["difficulty"] == "advanced"


def test_quiz_length_must_be_positive_shyam-thummar():
    with pytest.raises(ValueError):
        QuizRequest("content", "medium", -1)


def test_quiz_length_allowed_values_shyam-thummar():
    # Example of enforcing allowed quiz lengths: 5, 10, 15, 20
    allowed = {5, 10, 15, 20}
    req = QuizRequest("content", "easy", 10)
    assert req.num_questions in allowed
