<?php
// Vérifiez si le formulaire a été soumis via la méthode POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Récupération et nettoyage des données du formulaire
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    // 2. Vérification simple des données
    if (empty($name) OR empty($message) OR !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Redirection en cas d'erreur de validation
        header("Location: index.html?success=validation_error");
        exit;
    }

    // 3. Configuration de l'envoi
    $recipient = "benbachirnawel@gmail.com"; 
    $subject = "Nouveau message de contact de " . $name;
    
    // Contenu de l'email
    $email_content = "Nom: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";

    // En-têtes de l'email (pour l'expéditeur et le format)
    $email_headers = "From: " . $name . " <" . $email . ">";

    // 4. Envoi de l'email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Succès : Redirection vers la page d'accueil avec un statut de succès
        header("Location: index.html?success=true");
    } else {
        // Échec : Redirection avec un statut d'échec
        header("Location: index.html?success=false");
    }

} else {
    // Si la page est accédée directement sans soumission de formulaire
    header("Location: index.html");
    exit;
}
?>