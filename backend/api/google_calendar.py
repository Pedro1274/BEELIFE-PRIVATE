from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ["https://www.googleapis.com/auth/calendar"]
SERVICE_ACCOUNT_FILE = "credentials.json"

def add_event_to_google_calendar(event_data):
	creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
	service = build("calendar", "v3", credentials=creds)

	event = {
		"summary": event_data["title"],
		"description": event_data.get("description", ""),
		"start": {"dateTime": event_data["due_date"], "timeZone": "UTC"},
		"end": {"dateTime": event_data["due_date"], "timeZone": "UTC"},
	}

	event = service.events().insert(calendarId="primary", body=event).execute()
	return {"message": "Evento adicionado ao Google Calendar!", "event_id": event["id"]}