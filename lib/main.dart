import 'package:flutter/material.dart';
import 'pages/login_page.dart';
import 'services/notification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await NotificationService.init();

  runApp(MaterialApp(debugShowCheckedModeBanner: false, home: LoginPage()));
}
