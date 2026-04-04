#!/usr/bin/env node

/**
 * Validador de Sintaxis JSON para Universal Knowledge Base
 * Uso: node validate_json.js [archivo_json]
 */

const fs = require('fs');
const path = require('path');

function validateJSON(filePath) {
    try {
        // Leer el archivo
        const absolutePath = path.resolve(filePath);
        console.log(`🔍 Validando: ${absolutePath}`);
        
        const startTime = Date.now();
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        
        // Validar sintaxis JSON
        const parsedJSON = JSON.parse(fileContent);
        const endTime = Date.now();
        
        // Estadísticas
        const stats = {
            fileSize: fileContent.length,
            lines: fileContent.split('\n').length,
            parseTime: endTime - startTime,
            keys: countKeys(parsedJSON),
            valid: true
        };
        
        console.log('✅ JSON VÁLIDO');
        console.log(`📊 Estadísticas:`);
        console.log(`   - Tamaño: ${(stats.fileSize / 1024).toFixed(2)} KB`);
        console.log(`   - Líneas: ${stats.lines}`);
        console.log(`   - Tiempo parse: ${stats.parseTime}ms`);
        console.log(`   - Total claves: ${stats.keys}`);
        console.log(`   - Estructura: ${validateStructure(parsedJSON)}`);
        
        return true;
        
    } catch (error) {
        console.log('❌ JSON INVÁLIDO');
        console.log(`🚨 Error: ${error.message}`);
        
        // Intentar localizar el error
        const errorLocation = locateError(error.message, filePath);
        if (errorLocation) {
            console.log(`📍 Ubicación aproximada: Línea ${errorLocation.line}, Columna ${errorLocation.column}`);
            console.log(`📄 Contexto:`);
            console.log(errorLocation.context);
        }
        
        return false;
    }
}

function countKeys(obj, count = 0) {
    if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            count++;
            count = countKeys(obj[key], count);
        }
    }
    return count;
}

function validateStructure(json) {
    const expectedKeys = [
        'teWaza', 'ashiWaza', 'ukeWaza', 'kimeWaza', 'nageWaza', 'kansetsuWaza', 'shimeWaza',
        'katas_basicas', 'filosofia_y_conceptos', 'historia_y_linaje', 'sistema_grados_kyu', 'glosario_maestro'
    ];
    
    const missingKeys = expectedKeys.filter(key => !(key in json));
    const extraKeys = Object.keys(json).filter(key => !expectedKeys.includes(key));
    
    if (missingKeys.length === 0 && extraKeys.length === 0) {
        return '✅ Estructura completa y correcta';
    } else {
        return `⚠️  Faltan: [${missingKeys.join(', ')}] | Extra: [${extraKeys.join(', ')}]`;
    }
}

function locateError(errorMessage, filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        // Extraer número de línea del mensaje de error
        const lineMatch = errorMessage.match(/line (\d+)/i);
        const positionMatch = errorMessage.match(/position (\d+)/i);
        
        if (lineMatch) {
            const lineNumber = parseInt(lineMatch[1]);
            return {
                line: lineNumber,
                column: positionMatch ? parseInt(positionMatch[1]) : 0,
                context: getContext(lines, lineNumber)
            };
        }
    } catch (e) {
        // Ignorar errores en localización
    }
    
    return null;
}

function getContext(lines, lineNumber, contextLines = 3) {
    const start = Math.max(0, lineNumber - contextLines - 1);
    const end = Math.min(lines.length, lineNumber + contextLines);
    
    let context = '';
    for (let i = start; i < end; i++) {
        const marker = i === lineNumber - 1 ? '>>> ' : '    ';
        context += `${marker}${i + 1}: ${lines[i]}\n`;
    }
    
    return context;
}

// Ejecutar validación
const filePath = process.argv[2] || './data/universal_knowledge_base.json';
const isValid = validateJSON(filePath);

process.exit(isValid ? 0 : 1);
