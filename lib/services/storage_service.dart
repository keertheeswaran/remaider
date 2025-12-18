import 'dart:convert';
import 'dart:html' as html;
import '../models/event.dart';

class StorageService {
  // In-memory storage for the current session
  static Map<String, List<EventModel>> _memoryStorage = {};

  // Get the storage key for a specific user
  static String _getUserKey(String username) {
    return 'events_$username';
  }

  // Save a new event for a user
  static Future<void> saveEvent(String username, EventModel event) async {
    try {
      // Get existing events
      List<EventModel> events = await getEvents(username);

      // Add new event
      events.add(event);

      // Store in memory
      _memoryStorage[_getUserKey(username)] = events;

      // Automatically download as JSON file
      await _downloadAsJsonFile(username, events);

      print('✅ Event saved successfully! Total events: ${events.length}');
      print('📥 JSON file downloaded to your Downloads folder');
    } catch (e) {
      print('❌ Error saving event: $e');
      rethrow;
    }
  }

  // Download events as JSON file
  static Future<void> _downloadAsJsonFile(
      String username, List<EventModel> events) async {
    try {
      // Convert to JSON
      List<Map<String, dynamic>> jsonList =
          events.map((e) => e.toJson()).toList();

      // Create pretty formatted JSON string
      String jsonString = JsonEncoder.withIndent('  ').convert(jsonList);

      // Create blob
      final blob = html.Blob([jsonString], 'application/json');
      final url = html.Url.createObjectUrlFromBlob(blob);

      // Create download link
      final anchor = html.AnchorElement()
        ..href = url
        ..download = '${username}_events.json'
        ..style.display = 'none';

      // Add to DOM, click, and remove
      html.document.body?.append(anchor);
      anchor.click();
      anchor.remove();

      // Clean up
      html.Url.revokeObjectUrl(url);

      print('📄 File: ${username}_events.json');
      print('📊 Size: ${jsonString.length} characters');
    } catch (e) {
      print('❌ Error downloading JSON file: $e');
    }
  }

  // Get all events for a user
  static Future<List<EventModel>> getEvents(String username) async {
    try {
      final key = _getUserKey(username);

      // Check if data exists in memory
      if (_memoryStorage.containsKey(key)) {
        print('✅ Loaded ${_memoryStorage[key]!.length} events from memory');
        return List.from(_memoryStorage[key]!);
      }

      print('📁 No events found, returning empty list');
      return [];
    } catch (e) {
      print('❌ Error loading events: $e');
      return [];
    }
  }

  // Update an event at specific index
  static Future<void> updateEvent(
      String username, int index, EventModel updatedEvent) async {
    try {
      List<EventModel> events = await getEvents(username);

      if (index >= 0 && index < events.length) {
        events[index] = updatedEvent;

        // Store in memory
        _memoryStorage[_getUserKey(username)] = events;

        // Download updated JSON
        await _downloadAsJsonFile(username, events);

        print('✅ Event updated successfully');
      } else {
        print('❌ Invalid index: $index');
      }
    } catch (e) {
      print('❌ Error updating event: $e');
      rethrow;
    }
  }

  // Delete an event at specific index
  static Future<void> deleteEvent(String username, int index) async {
    try {
      List<EventModel> events = await getEvents(username);

      if (index >= 0 && index < events.length) {
        events.removeAt(index);

        // Store in memory
        _memoryStorage[_getUserKey(username)] = events;

        // Download updated JSON
        await _downloadAsJsonFile(username, events);

        print('✅ Event deleted successfully');
      } else {
        print('❌ Invalid index: $index');
      }
    } catch (e) {
      print('❌ Error deleting event: $e');
      rethrow;
    }
  }

  // Delete all events for a user
  static Future<void> deleteAllEvents(String username) async {
    try {
      _memoryStorage.remove(_getUserKey(username));
      print('✅ All events deleted from memory');
    } catch (e) {
      print('❌ Error deleting all events: $e');
      rethrow;
    }
  }

  // Manually download current events as JSON file
  static Future<void> downloadEventsAsJson(String username) async {
    try {
      List<EventModel> events = await getEvents(username);
      await _downloadAsJsonFile(username, events);
      print('✅ Events exported to JSON file');
    } catch (e) {
      print('❌ Error downloading events: $e');
      rethrow;
    }
  }

  // Load events from uploaded JSON file
  static Future<void> loadFromJsonFile(
    String username,
    html.File file,
  ) async {
    try {
      final reader = html.FileReader();

      reader.onLoadEnd.listen((e) async {
        try {
          String jsonString = reader.result as String;

          // Parse JSON
          List<dynamic> jsonList = json.decode(jsonString);

          // Convert to EventModel list
          List<EventModel> events =
              jsonList.map((json) => EventModel.fromJson(json)).toList();

          // Store in memory
          _memoryStorage[_getUserKey(username)] = events;

          print('✅ Loaded ${events.length} events from file: ${file.name}');
        } catch (e) {
          print('❌ Error parsing JSON file: $e');
        }
      });

      reader.readAsText(file);
    } catch (e) {
      print('❌ Error loading JSON file: $e');
      rethrow;
    }
  }

  // Import events from JSON string
  static Future<void> importEventsFromJson(
      String username, String jsonString) async {
    try {
      List<dynamic> jsonList = json.decode(jsonString);
      List<EventModel> events =
          jsonList.map((json) => EventModel.fromJson(json)).toList();

      // Store in memory
      _memoryStorage[_getUserKey(username)] = events;

      // Download as file
      await _downloadAsJsonFile(username, events);

      print('✅ Events imported successfully: ${events.length} events');
    } catch (e) {
      print('❌ Error importing events: $e');
      rethrow;
    }
  }

  // Export events as JSON string
  static Future<String> exportEventsAsJson(String username) async {
    try {
      List<EventModel> events = await getEvents(username);
      List<Map<String, dynamic>> jsonList =
          events.map((e) => e.toJson()).toList();
      return JsonEncoder.withIndent('  ').convert(jsonList);
    } catch (e) {
      print('❌ Error exporting events: $e');
      return '[]';
    }
  }

  // Get total number of events
  static Future<int> getEventCount(String username) async {
    List<EventModel> events = await getEvents(username);
    return events.length;
  }

  // Check if user has any events
  static Future<bool> hasEvents(String username) async {
    return _memoryStorage.containsKey(_getUserKey(username));
  }

  // Search events by name or description
  static Future<List<EventModel>> searchEvents(
      String username, String query) async {
    try {
      List<EventModel> allEvents = await getEvents(username);

      if (query.isEmpty) {
        return allEvents;
      }

      return allEvents.where((event) {
        return event.name.toLowerCase().contains(query.toLowerCase()) ||
            event.description.toLowerCase().contains(query.toLowerCase());
      }).toList();
    } catch (e) {
      print('❌ Error searching events: $e');
      return [];
    }
  }

  // Sort events by date
  static Future<List<EventModel>> getSortedEvents(
    String username, {
    bool ascending = true,
  }) async {
    try {
      List<EventModel> events = await getEvents(username);

      events.sort((a, b) {
        try {
          DateTime dateA = DateTime.parse(a.date);
          DateTime dateB = DateTime.parse(b.date);
          return ascending ? dateA.compareTo(dateB) : dateB.compareTo(dateA);
        } catch (e) {
          return 0;
        }
      });

      return events;
    } catch (e) {
      print('❌ Error sorting events: $e');
      return [];
    }
  }

  // Preview JSON format (for display purposes)
  static Future<String> previewJsonFormat(String username) async {
    try {
      List<EventModel> events = await getEvents(username);

      if (events.isEmpty) {
        return '''[
  {
    "name": "Example Event",
    "date": "2024-12-25",
    "description": "This is how your events will be saved"
  }
]''';
      }

      List<Map<String, dynamic>> jsonList =
          events.map((e) => e.toJson()).toList();
      return JsonEncoder.withIndent('  ').convert(jsonList);
    } catch (e) {
      return '[]';
    }
  }
}
