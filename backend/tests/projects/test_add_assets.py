import os
from unittest.mock import MagicMock, patch, AsyncMock
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from io import BytesIO

from app.main import app
from app.repositories import project_repository
from app.models import Asset
from app.config import settings
from app.database import get_db

# Test client setup
client = TestClient(app)


@pytest.fixture
def mock_db():
    """Fixture to mock the database session"""
    return MagicMock(spec=Session)


@pytest.fixture
def mock_file():
    """Fixture to mock an uploaded PDF file"""
    file_content = BytesIO(b"Dummy PDF content")
    return UploadFile(filename="test.pdf", file=file_content)


@pytest.fixture
def mock_non_pdf_file():
    """Fixture to mock an uploaded non-PDF file"""
    file_content = BytesIO(b"Dummy non-PDF content")
    return UploadFile(filename="test.txt", file=file_content)


def override_get_db():
    """Override the get_db dependency to use the mock_db"""
    mock_db_instance = MagicMock(spec=Session)
    yield mock_db_instance


app.dependency_overrides[get_db] = override_get_db


@patch("app.repositories.project_repository.get_project")
@patch("app.api.v1.projects.open")
@patch("app.api.v1.projects.os.makedirs")
@patch("app.api.v1.projects.file_preprocessor.submit")
@patch("app.api.v1.projects.preprocess_file")
def test_upload_files_success(
    mock_preprocess_file,
    mock_submit,
    mock_makedirs,
    mock_open,
    mock_get_project,
    mock_file,
):
    """Test uploading files successfully"""
    mock_get_project.return_value = MagicMock(id=1)
    mock_open.return_value.__enter__.return_value.write = MagicMock()

    response = client.post(
        "/v1/projects/1/assets",
        files={"files": ("test.pdf", mock_file.file, "application/pdf")},
    )

    assert response.status_code == 200
    assert response.json() == "Successfully uploaded the files"

    # Check if the file was saved
    mock_open.assert_called_once_with(
        os.path.join(settings.upload_dir, "1", "test.pdf"), "wb"
    )

    # Check if the processing task was submitted
    mock_submit.assert_called_once()


@patch("app.repositories.project_repository.get_project")
def test_upload_files_project_not_found(mock_get_project, mock_file, mock_db):
    """Test uploading files when project is not found"""
    mock_get_project.return_value = None

    response = client.post(
        "/v1/projects/1/assets",
        files={"files": ("test.pdf", mock_file.file, "application/pdf")},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "Project not found"}


@patch("app.repositories.project_repository.get_project")
def test_upload_files_non_pdf(mock_get_project, mock_non_pdf_file, mock_db):
    """Test uploading a non-PDF file"""
    mock_get_project.return_value = MagicMock(id=1)

    response = client.post(
        "/v1/projects/1/assets",
        files={"files": ("test.txt", mock_non_pdf_file.file, "application/txt")},
    )

    assert response.status_code == 400
    assert response.json() == {"detail": "The file test.txt is not a PDF"}
