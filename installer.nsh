; Configuración personalizada del instalador NSIS
!include "MUI2.nsh"

; Configurar páginas del instalador
!define MUI_WELCOMEPAGE_TITLE "Bienvenido al instalador de SEPRICE"
!define MUI_WELCOMEPAGE_TEXT "Este asistente le guiará en la instalación de SEPRICE - Sistema de Gestión Médica.$\r$\n$\r$\nSe recomienda cerrar todas las demás aplicaciones antes de continuar."

!define MUI_FINISHPAGE_TITLE "Instalación completada"
!define MUI_FINISHPAGE_TEXT "SEPRICE ha sido instalado exitosamente en su computadora.$\r$\n$\r$\nHaga clic en Finalizar para cerrar este asistente."

; Verificar si Visual C++ Redistributable está instalado
Function .onInit
  ; Verificar si ya está instalado
  ReadRegStr $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64" "Version"
  StrCmp $0 "" 0 vcredist_done
  
  ; Si no está instalado, mostrar mensaje
  MessageBox MB_YESNO "SEPRICE requiere Microsoft Visual C++ Redistributable para funcionar correctamente.$\r$\n¿Desea descargarlo e instalarlo ahora?" IDYES vcredist_install IDNO vcredist_skip
  
  vcredist_install:
    ExecShell "open" "https://aka.ms/vs/17/release/vc_redist.x64.exe"
    MessageBox MB_OK "Por favor, instale Visual C++ Redistributable y luego continúe con la instalación de SEPRICE."
    Abort
  
  vcredist_skip:
    MessageBox MB_OK "Advertencia: SEPRICE podría no funcionar correctamente sin Visual C++ Redistributable."
  
  vcredist_done:
FunctionEnd

; Crear acceso directo en el escritorio
Function CreateDesktopShortcut
  CreateShortCut "$DESKTOP\SEPRICE.lnk" "$INSTDIR\SEPRICE - Sistema de Gestión Médica.exe" "" "$INSTDIR\resources\app\public\icon.ico"
FunctionEnd

; Configurar firewall de Windows
Function ConfigureFirewall
  ; Agregar excepción al firewall para el puerto 3000
  nsExec::ExecToLog 'netsh advfirewall firewall add rule name="SEPRICE" dir=in action=allow protocol=TCP localport=3000'
FunctionEnd

; Función que se ejecuta después de la instalación
Function .onInstSuccess
  Call CreateDesktopShortcut
  Call ConfigureFirewall
FunctionEnd
