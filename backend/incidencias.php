<?php

require 'db.php';


function obtenerRolPorUsuario()
{

    global $pdo;
    try {
        $sql = "SELECT * FROM rolesporusuario";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener roles por usuario: " . $th->getMessage());
        return [];
    }
}
function obtenerRoles()
{
    global $pdo;
    try {
        $sql = "SELECT * FROM Rol";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener roles: " . $th->getMessage());
        return [];
    }
}

function obtenerWatchers($id_incidencias = null)
{
    global $pdo;
    try {
        if ($id_incidencias) {
            $sql = "SELECT * FROM WatchersPorIncidencia WHERE id_incidencias = :id_incidencias";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id_incidencias' => $id_incidencias,
            ]);
        } else {
            $sql = "SELECT * FROM WatchersPorIncidencia";
            $stmt = $pdo->query($sql);
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener watchers: " . $th->getMessage());
        return [];
    }
}

function obtenerResponder($id_incidencias = null)
{
    global $pdo;
    try {
        if ($id_incidencias) {
            $sql = "SELECT * FROM RespondersPorIncidencia WHERE id_incidencias = :id_incidencias";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id_incidencias' => $id_incidencias,
            ]);
        } else {
            $sql = "SELECT * FROM RespondersPorIncidencia";
            $stmt = $pdo->query($sql);
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener responder: " . $th->getMessage());
        return [];
    }
}

function obtenerIncidencias($id_incidencias = null)
{
    global $pdo;
    try {
        if ($id_incidencias) {
            $sql = "SELECT * FROM incidencias WHERE id_incidencias = :id_incidencias";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id_incidencias' => $id_incidencias
            ]);
        } else {
            $sql = "SELECT * FROM incidencias";
            $stmt = $pdo->query($sql);
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener incidencias: " . $th->getMessage());
        return [];
    }
}

function obtenerUsuarios()
{
    global $pdo;

    try {
        $sql = "SELECT id_usuario, userName FROM usuarios";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener prioridades: " . $th->getMessage());
        return [];
    }
}

function obtenerPrioridades()
{
    global $pdo;

    try {
        $sql = "SELECT id_prioridad, nombre, color FROM Prioridad";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener prioridades: " . $th->getMessage());
        return [];
    }
}

function obtenerStatus()
{
    global $pdo;

    try {
        $sql = "SELECT id_status, nombre FROM Status";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (\Throwable $th) {
        logError("Error al obtener status: " . $th->getMessage());
        return [];
    }
}

function crearIncidencia($id_usuario, $nombre, $descripcion, $id_status, $id_prioridad)
{
    global $pdo;
    try {
        $sql = "INSERT INTO incidencias (id_usuario, nombre, descripcion, id_status, id_prioridad) 
        values (:id_usuario, :nombre, :descripcion,:id_status, :id_prioridad)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_usuario' => $id_usuario,
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'id_status' => $id_status,
            'id_prioridad' => $id_prioridad
        ]);
        return $pdo->lastInsertId();
    } catch (\Throwable $th) {
        logError("Error al crear incidencia: " . $th->getMessage());
        return false;
    }
}

function insertarRolPorUsuario($id_rol, $id_usuario, $id_incidencia)
{
    global $pdo;
    try {
        $sql = "INSERT INTO rolesporusuario (id_rol, id_usuario, id_incidencia) VALUES (:id_rol, :id_usuario, :id_incidencia)";    
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_rol' => $id_rol,
            'id_usuario' => $id_usuario,
            'id_incidencia' => $id_incidencia
        ]);
        return $stmt->rowCount() > 0;
    } catch (\Throwable $th) {
        logError("Error al insertar rol por usuario: " . $th->getMessage());
        return false;
    }
}

function insertarWatcher($id_incidencia, $id_usuario)
{

    global $pdo;
    try {
        $sql = "INSERT INTO watchersporincidencia (id_incidencia, id_usuario) VALUES (:id_incidencia, :id_usuario)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_incidencia' => $id_incidencia,
            'id_usuario' => $id_usuario
        ]);
        
        return $stmt->rowCount() > 0;
    } catch (\Throwable $th) {
        logError("Error al insertar watcher: " . $th->getMessage());
        return false;
    }
}

function insertarResponder($id_incidencia, $id_usuario)
{
    global $pdo;
    try {
        $sql = "INSERT INTO respondersporincidencia (id_incidencia, id_usuario) VALUES (:id_incidencia, :id_usuario)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id_incidencia' => $id_incidencia,
            'id_usuario' => $id_usuario
        ]);
        return $stmt->rowCount() > 0;
    } catch (\Throwable $th) {
        logError("Error al insertar responder: " . $th->getMessage());
        return false;
    }
}

function editarIncidencia($id_incidencias, $id_usuario, $nombre, $descripcion, $id_status, $id_prioridad)
{
    global $pdo; // Asegúrate de tener $pdo disponible en el contexto global
    try {
        $sql = "UPDATE incidencias 
                SET nombre = :nombre, 
                    descripcion = :descripcion, 
                    id_status = :id_status, 
                    id_prioridad = :id_prioridad 
                WHERE id_usuario = :id_usuario AND id_incidencias = :id_incidencias";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            'id_incidencias' => $id_incidencias,
            'id_usuario' => $id_usuario,
            'nombre' => $nombre,
            'descripcion' => $descripcion,
            'id_status' => $id_status,
            'id_prioridad' => $id_prioridad
        ]);

        $affected_rows = $stmt->rowCount();
        return $affected_rows > 0;
    } catch (\Throwable $th) {
        logError("Error al editar incidencia: " . $th->getMessage());
        return false;
    }
}

function eliminarIncidencia($id_incidencia)
{

    global $pdo;

    try {
        $sql = "DELETE FROM incidencias WHERE id_incidencias = :id_incidencias";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(([
            'id_incidencias' => $id_incidencia
        ]));
        return $stmt->rowCount() > 0;
    } catch (\Throwable $th) {
        logError("Error al eliminar incidencia: " . $th->getMessage());
        return false;
    }
}

function sendResponse($statusCode, $message)
{
    http_response_code($statusCode);
    echo json_encode(['message' => $message]);
    exit;
}



$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents('php://input'), true);
}
session_start();
if (isset($_SESSION['user_id'])) {

    $user_id = $_SESSION['user_id'];
    logDebug("Usuario loggeado: $user_id");
    $input = getJsonInput();
    switch ($method) {
        case 'POST':
            if (isset($input['nombre'], $input['descripcion'], $input['id_status'], $input['id_prioridad'])) {
                $id_incidencia = crearIncidencia($user_id, $input['nombre'], $input['descripcion'], $input['id_status'], $input['id_prioridad']);
                if ($id_incidencia > 0) {
                    sendResponse(201, ['id_incidencia' => $id_incidencia]);
                } else {
                    sendResponse(500, 'Error al crear incidencia');
                }
            } elseif (isset($input['id_incidencias'], $input['id_usuario'], $input['action'])) {
                $id_incidenciaWR = $input['id_incidencias'];
                $id_usuarioWR = $input['id_usuario'];
                $action = $input['action'];

                error_log("id_incidencia: $id_incidenciaWR, id_usuario: $id_usuarioWR, action: $action");

                if ($action === 'watcher') {
                    $insertW = insertarWatcher($id_incidenciaWR, $id_usuarioWR);
                    $insertW ? sendResponse(201, 'Watcher insertado correctamente')
                        : sendResponse(500, 'Error al insertar watcher');
                } elseif ($action === 'responder') {
                    $insertR = insertarResponder($id_incidenciaWR, $id_usuarioWR);
                    $insertR
                        ? sendResponse(201, 'Responder insertado correctamente')
                        : sendResponse(500, 'Error al insertar responder');
                } else {
                    sendResponse(400, 'Acción no válida');
                }
            } else if(isset($input['id_rol'], $input['id_usuario'])) {
                $insertarRPU =insertarRolPorUsuario($input['id_rol'], $input['id_usuario'], $input['id_incidencia']);
                $insertarRPU ? sendResponse(201, 'Rol insertado correctamente')
                    : sendResponse(500, 'Error al insertar rol');

            }else {
                sendResponse(400, 'Faltan datos');
            }
            break;
        case 'GET':
            $prioridades = obtenerPrioridades();
            $status = obtenerStatus();
            $usuario = obtenerUsuarios();
            $roles = obtenerRoles();
            $rolesporusuario = obtenerRolPorUsuario();
            if (isset($input['id_incidencias'])) {
                $id_incidencias = $_GET['id_incidencias'];
                $incidencias = obtenerIncidencias($id_incidencias);
                $responder = obtenerResponder($id_incidencias);
                $watchers = obtenerWatchers($id_incidencias);
            } else {
                $incidencias = obtenerIncidencias();
                $responder = obtenerResponder();
                $watchers = obtenerWatchers();
            }
            echo json_encode([
                'prioridades' => $prioridades,
                'incidencias' => $incidencias,
                'status' => $status,
                'usuarios' => $usuario,
                'responder' => $responder,
                'watchers' => $watchers,
                'roles' => $roles,
                'rolesporusuario' => $rolesporusuario

            ]);
            break;
        case 'PUT':
            if (isset($input['id_incidencias'], $input['nombre'], $input['descripcion'], $input['id_status'], $input['id_prioridad'])) {
                $actualizado = editarIncidencia($input['id_incidencias'], $user_id, $input['nombre'], $input['descripcion'], $input['id_status'], $input['id_prioridad']);
                if ($actualizado) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Incidencia actualizada correctamente']);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Incidencia no encontrada']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Faltan datos']);
            }
            break;
        case 'DELETE':
            if (isset($_GET['id_incidencias'])) {
                $eliminado = eliminarIncidencia($_GET['id_incidencias']);
                if ($eliminado) {
                    http_response_code(200);
                    echo json_encode(['message' => 'Incidencia eliminada correctamente']);
                } else {
                    http_response_code(404);
                    echo json_encode(['message' => 'Incidencia no encontrada']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Faltan datos']);
            }
            break;
        default:
            http_response_code(405);
            echo json_encode(['message' => 'Metodo no permitido']);
            break;
    }
} else {
    http_response_code(401);
    echo json_encode(['message' => 'No autorizado']);
}