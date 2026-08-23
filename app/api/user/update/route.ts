import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request) {
  console.log("1️⃣ PATCH /api/user/update STARTED");

  try {
    // Call auth() directly inside the function
    const session = await auth();
    console.log("2️⃣ Session:", session);

    if (!session?.user?.id) {
      console.log("❌ No authenticated user");
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    console.log("3️⃣ User ID:", session.user.id);

    const body = await req.json();
    console.log("4️⃣ Request body:", body);

    const { name, email, currentPassword, newPassword } = body;

    console.log("5️⃣ Finding user...");
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    console.log("6️⃣ Existing user:", existingUser);

    if (!existingUser) {
      return NextResponse.json(
        { error: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    const dataToUpdate: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (name?.trim()) {
      dataToUpdate.name = name.trim();
    }

    if (email?.trim() && email !== existingUser.email) {
      console.log("7️⃣ Checking email availability...");

      const emailTaken = await prisma.user.findUnique({
        where: { email: email.trim() },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé." },
          { status: 409 }
        );
      }

      dataToUpdate.email = email.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Mot de passe actuel requis." },
          { status: 400 }
        );
      }

      if (!existingUser.password) {
        return NextResponse.json(
          { error: "Ce compte n'a pas de mot de passe défini." },
          { status: 400 }
        );
      }
      console.log("Password check:", {
        email: existingUser.email,
        currentPasswordLength: currentPassword?.length,
        currentPasswordRaw: JSON.stringify(currentPassword),
      });

      const isValid = await bcrypt.compare(
        currentPassword,
        existingUser.password
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect." },
          { status: 401 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          {
            error:
              "Le nouveau mot de passe doit contenir au moins 6 caractères.",
          },
          { status: 400 }
        );
      }

      dataToUpdate.password = await bcrypt.hash(newPassword, 10);
    }

    console.log("8️⃣ Data to update:", dataToUpdate);

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { error: "Aucune modification à effectuer." },
        { status: 400 }
      );
    }

    console.log("9️⃣ Updating database...");

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    console.log("🔟 Updated successfully:", updatedUser);

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}