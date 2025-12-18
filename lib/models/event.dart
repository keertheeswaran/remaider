class EventModel {
  String name;
  String date;
  String description;

  EventModel({
    required this.name,
    required this.date,
    required this.description,
  });

  Map<String, dynamic> toJson() => {
        "name": name,
        "date": date,
        "description": description,
      };

  static EventModel fromJson(Map<String, dynamic> json) => EventModel(
        name: json["name"],
        date: json["date"],
        description: json["description"],
      );
}
