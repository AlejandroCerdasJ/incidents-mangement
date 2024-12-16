<?php

require 'db.php';

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

function obtenerUsuarios(){
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

function crearIncidencia($id_usuario, $nombre, $descripcion,$id_status, $id_prioridad)
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



$method = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

function getJsonInput()
{
    return json_decode(file_get_contents('php://input'), true);
}
session_start();
if (isset($_SESSION['user_id'])) {

    $user_id = $_SESSION['user_id'];
    logDebug("Usuario logeado: $user_id");
    $input = getJsonInput();
    switch ($method) {
        case 'POST':
            if (isset($input['nombre'], $input['descripcion'], $input['id_status'], $input['id_prioridad'])) {
              
                $id_incidencia = crearIncidencia($user_id, $input['nombre'], $input['descripcion'],  $input['id_status'], $input['id_prioridad']);
                if ($id_incidencia > 0) {
               
                    http_response_code(201);
                    echo json_encode(['id_incidencia' => $id_incidencia]);
                } else {
                
                    http_response_code(500);
                    echo json_encode(['message' => 'Error al crear incidencia']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Faltan datos']);
            }
            break;
        case 'GET':
            $prioridades = obtenerPrioridades();
            $status = obtenerStatus();
            $usuario = obtenerUsuarios();
            if (isset($input['id_incidencias']))  {
                $id_incidencias = $_GET['id_incidencias'];
                $incidencias = obtenerIncidencias($id_incidencias); 
            } else {
                $incidencias = obtenerIncidencias();
            }
            echo json_encode([
                'prioridades' => $prioridades,
                'incidencias' => $incidencias,
                'status' => $status,
                'usuarios' => $usuario
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