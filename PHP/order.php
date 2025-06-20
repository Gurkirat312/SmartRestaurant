<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "restaurant");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "DB connection failed"]));
}

$data = json_decode(file_get_contents("php://input"), true);
$total = 0;

foreach ($data['items'] as $item) {
    $name = $item['name'];
    $qty = $item['quantity'];
    $price = $item['price'];
    $total += $qty * $price;

    $stmt = $conn->prepare("INSERT INTO orders (item, quantity, price) VALUES (?, ?, ?)");
    $stmt->bind_param("sid", $name, $qty, $price);
    $stmt->execute();
}

echo json_encode(["status" => "success", "total" => $total]);
?>
