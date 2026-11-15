import {expect,test} from '@playwright/test';
import {PDFDocument} from 'pdf-lib';
import {RIASEC_ITEMS} from '../packages/brujula-core/src/items';

test('Registro, 36 respuestas, etapas, perfil, carreras y PDF de cuatro páginas',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await page.getByRole('button',{name:'Encontrar mi rumbo'}).click();
  await page.getByLabel('¿Cómo te llamas?').fill('María José');
  await page.getByLabel('¿En qué etapa estás?').selectOption('Bachillerato');
  const province=page.getByLabel('Provincia',{exact:true}),canton=page.getByLabel('Cantón',{exact:true});
  await province.selectOption('PICHINCHA');await canton.selectOption('RUMIÑAHUI');
  await province.selectOption('AZUAY');await expect(canton).toHaveValue('');
  await province.selectOption('PICHINCHA');await canton.selectOption('DISTRITO METROPOLITANO DE QUITO');
  await page.getByRole('button',{name:'Comenzar mi test'}).click();
  await expect(page.locator('.brujula-form .pf__topbar')).toHaveCount(0);
  await expect(page.getByTestId('pf-progress')).toHaveCount(0);
  const questionTop=await page.locator('.pf__question').boundingBox();
  expect(questionTop!.y).toBeLessThan(180);
  expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBe(true);
  for(let i=0;i<36;i++){
    await expect(page.getByRole('heading',{name:RIASEC_ITEMS[i][1],exact:true})).toBeVisible();
    await page.getByRole('radio').nth([4,3,0,1,2,0][i%6]).click();
    if((i+1)%12===0){
      await expect(page.locator('.bcf-celebration')).toBeVisible();
      await page.waitForTimeout(2100);
      await expect(page.locator('.bcf-celebration')).toBeVisible();
    }
  }
  await expect(page.getByRole('heading',{name:'María José, tu rumbo toma forma.'})).toBeVisible();
  await expect(page.getByText('RIE',{exact:true})).toBeVisible();
  await expect(page.locator('.bdr-radar svg')).toBeVisible();
  await expect(page.getByRole('meter',{name:'Realista',exact:true})).toHaveAttribute('aria-valuenow','100');
  await expect(page.getByRole('meter',{name:'Investigativo',exact:true})).toHaveAttribute('aria-valuenow','75');
  await expect(page.getByRole('link',{name:/Derecho/})).toContainText(/4,48\s*%/);
  await expect(page.getByRole('link',{name:/Comunicación/})).toContainText(/9,90\s*%/);
  await expect(page.getByRole('link',{name:/Ciencia de Datos/})).toContainText('Sin estimación por título');
  const explorer=page.getByText('Explorar tasas de desempleo',{exact:true});
  await explorer.click();
  await page.getByLabel('Tipo de grupo').selectOption('industry');
  await page.getByLabel('Buscar por nombre o código').fill('a0111');
  await page.getByLabel('Grupo de la ENEMDU').selectOption('CIIU 4.1|A0111');
  await expect(page.getByText('CIIU 4.1 · A0111',{exact:true})).toBeVisible();
  await expect(page.getByText('Ecuador · 2024T1–2025T3 · Clase',{exact:true})).toBeVisible();
  await explorer.click();
  await page.locator('.bdr-career-link').filter({hasText:'Derecho'}).click();
  await expect(page).toHaveURL(/\/carreras\/derecho$/);
  await expect(page.getByRole('heading',{name:'Derecho',exact:true})).toBeVisible();
  await expect(page.getByText(/Abogado\/a · CNTP 30330101/)).toBeVisible();
  await page.reload();await expect(page.getByRole('heading',{name:'Derecho',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'Volver a mi dashboard'}).click();
  await expect(page.getByRole('heading',{name:'María José, tu rumbo toma forma.'})).toBeVisible();
  await page.getByRole('button',{name:'Enviar por correo'}).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByLabel('Correo electrónico',{exact:true}).fill('prueba@example.com');
  await expect(page.getByRole('button',{name:'Enviar mi perfil'})).toBeDisabled();
  await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar PDF'}).click()]);
  const stream=await download.createReadStream();const chunks:Buffer[]=[];
  for await(const chunk of stream!)chunks.push(Buffer.from(chunk));
  const pdf=await PDFDocument.load(Buffer.concat(chunks));expect(pdf.getPageCount()).toBe(4);
  expect(pdf.getTitle()).toContain('María José');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await page.getByRole('button',{name:'Repetir test',exact:true}).click();
  await page.getByRole('button',{name:'Sí, repetir test'}).click();
  await expect(page.getByRole('button',{name:'Encontrar mi rumbo'})).toBeVisible();
});

test('Retroceder conserva la respuesta y no exige campos opcionales',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Encontrar mi rumbo'}).click();
  await page.getByLabel('¿Cómo te llamas?').fill('Alex');await page.getByLabel('¿En qué etapa estás?').selectOption('Educación superior');
  await page.getByRole('button',{name:'Comenzar mi test'}).click();
  await page.getByRole('radio').nth(4).click();
  await expect(page.getByRole('heading',{name:RIASEC_ITEMS[1][1],exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Atrás',exact:true}).click();
  await expect(page.getByRole('radio').nth(4)).toHaveAttribute('aria-checked','true');
});
