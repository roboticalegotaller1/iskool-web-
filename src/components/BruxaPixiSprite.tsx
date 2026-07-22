"use client";

import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface BruxaPixiSpriteProps {
  className?: string;
  width?: number;
  height?: number;
}

export const BruxaPixiSprite: React.FC<BruxaPixiSpriteProps> = ({
  className = "w-24 h-28",
  width = 96,
  height = 112
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let app: PIXI.Application | null = null;
    let isDestroyed = false;

    const initPixi = async () => {
      const container = containerRef.current;
      if (!container || isDestroyed) return;

      container.innerHTML = '';

      // Crear aplicación Pixi.js v8
      app = new PIXI.Application();
      await app.init({
        width,
        height,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      if (isDestroyed) {
        app.destroy(true, { children: true });
        return;
      }

      if (container && app.canvas) {
        container.appendChild(app.canvas as HTMLCanvasElement);
      }

      // 1. Cargar la textura base de la imagen en la ruta pública /images/caracteres/bruja/bruxa.png
      const texturePath = '/images/caracteres/bruja/bruxa.png';
      let baseTexture: PIXI.Texture;
      try {
        baseTexture = await PIXI.Assets.load(texturePath);
      } catch (err) {
        baseTexture = PIXI.Texture.from(texturePath);
      }

      if (isDestroyed || !app || !app.stage) return;

      const baseWidth = baseTexture.width || 128;
      const baseHeight = baseTexture.height || 128;

      // 2. Dividir la imagen matemáticamente usando PIXI.Rectangle (2 columnas x 2 filas = 4 fotogramas)
      const frameWidth = baseWidth / 2;
      const frameHeight = baseHeight / 2;
      const textures: PIXI.Texture[] = [];

      const source = baseTexture.source;

      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 2; col++) {
          const rect = new PIXI.Rectangle(
            col * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight
          );

          const frameTexture = new PIXI.Texture({
            source,
            frame: rect
          });
          textures.push(frameTexture);
        }
      }

      // 3. Crear el PIXI.AnimatedSprite con el arreglo de 4 texturas, animationSpeed = 0.15 y reproducir en bucle
      const animSprite = new PIXI.AnimatedSprite(textures);
      animSprite.animationSpeed = 0.15;
      animSprite.loop = true;
      animSprite.play();

      // 4. Anclaje al centro (anchor.set(0.5)) y efecto espejo (scale.x = -1) para que la bruja mire a la derecha
      animSprite.anchor.set(0.5);
      animSprite.x = width / 2;
      animSprite.y = height / 2;

      // Escala horizontal negativa para efecto espejo
      const scaleFactor = Math.min(width / frameWidth, height / frameHeight) * 0.9;
      animSprite.scale.set(-scaleFactor, scaleFactor);

      app.stage.addChild(animSprite);
    };

    initPixi();

    return () => {
      isDestroyed = true;
      if (app) {
        try {
          app.destroy(true, { children: true });
        } catch (e) {
          // cleanup safe
        }
      }
    };
  }, [width, height]);

  return (
    <div 
      ref={containerRef} 
      className={`relative inline-flex items-center justify-center filter drop-shadow-[0_6px_12px_rgba(168,85,247,0.8)] ${className}`}
    />
  );
};
