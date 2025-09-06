mod socket;

use socket::start_socket_server;
use tauri::Manager;
use tauri_plugin_window_state::{self, AppHandleExt};
use window_vibrancy::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let fname = app_handle.filename();
            std::thread::spawn(move || start_socket_server(&app_handle));

            let main_window = Manager::get_webview_window(app, "main")
                .unwrap()
                .as_ref()
                .window();
            let command_window = Manager::get_webview_window(app, "commands")
                .unwrap()
                .as_ref()
                .window();
            command_window
                .set_ignore_cursor_events(true)
                .expect("Unable to ignore cursor events on command window");
            #[cfg(target_os = "macos")]
            apply_vibrancy(
                &main_window,
                NSVisualEffectMaterial::Dark,
                Some(NSVisualEffectState::Active),
                Some(9.0),
            )
            .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&main_window, Some((18, 18, 18, 125)))
                .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            let app_dir = app.path().app_config_dir()?;
            println!("{}", app_dir.display());
            let state_path = app_dir.join(fname);
            if std::fs::File::open(state_path).is_err() {
                let monitor = app.primary_monitor().unwrap().unwrap();
                let size = monitor.size();
                let scale = monitor.scale_factor() as u32;
                let offset: u32 = 24;
                let main_size = main_window.outer_size().unwrap();
                let com_size = command_window.outer_size().unwrap();
                let win_pos = tauri::PhysicalPosition {
                    x: size.width - (offset * scale + main_size.width),
                    y: size.height - offset * scale,
                };
                let _ = main_window.set_position(tauri::PhysicalPosition {
                    y: win_pos.y - main_size.height,
                    ..win_pos
                });
                let _ = command_window.set_position(tauri::PhysicalPosition {
                    y: win_pos.y - (main_size.height + com_size.height),
                    ..win_pos
                });
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
