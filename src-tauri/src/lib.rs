use tauri::Manager;
use tauri_plugin_positioner::{Position, WindowExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let _ = Manager::get_webview_window(app, "main")
                .unwrap()
                .as_ref()
                .window()
                .move_window(Position::BottomRight);
            let command_window = Manager::get_webview_window(app, "commands")
                .unwrap()
                .as_ref()
                .window();
            let _ = command_window.set_ignore_cursor_events(true);
            let _ = command_window.move_window(Position::BottomRight);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
