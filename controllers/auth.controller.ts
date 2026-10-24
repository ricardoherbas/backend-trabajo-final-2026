import { Request, Response } from 'express';
import { registrarFamiliar, iniciarSesion, obtenerPerfil, solicitarRecuperacionPassword, restablecerPassword } from '../services/auth.service';
import { RequestAutenticado } from '../middlewares/auth.middleware';

export const registrar = async (req: Request, res: Response): Promise<void> => {
    try {
        const usuario = await registrarFamiliar(req.body);
        res.status(201).json({
            mensaje: 'Familiar registrado correctamente',
            usuario,
        });
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al registrar familiar';
        res.status(400).json({ mensaje });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const resultado = await iniciarSesion(req.body);
        res.status(200).json(resultado);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al iniciar sesión';
        res.status(401).json({ mensaje });
    }
};

export const perfil = async (req: RequestAutenticado, res: Response): Promise<void> => {
    try {
        if (!req.usuario) {
            res.status(401).json({ mensaje: 'Usuario no autenticado' });
            return;
        }
        const usuario = await obtenerPerfil(req.usuario.id);
        res.status(200).json(usuario);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'Error al obtener perfil';
        res.status(404).json({ mensaje });
    }
};

export const solicitarRecuperacion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        if (!email || typeof email !== 'string') {
            res.status(400).json({ mensaje: 'Debés ingresar un email válido' });
            return;
        }
        const resultado = await solicitarRecuperacionPassword(email);
        res.status(200).json(resultado);
    } catch {
        res.status(500).json({ mensaje: 'No se pudo procesar la solicitud de recuperación de contraseña' });
    }
};

export const restablecer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, nuevaPassword } = req.body;
        if (!token || typeof token !== 'string' || !nuevaPassword || typeof nuevaPassword !== 'string') {
            res.status(400).json({ mensaje: 'El token y la nueva contraseña son obligatorios' });
            return;
        }
        const resultado = await restablecerPassword(token, nuevaPassword);
        res.status(200).json(resultado);
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : 'No se pudo restablecer la contraseña';
        res.status(400).json({ mensaje });
    }
};