--Insert Tony Stark into an account 
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
	)
VALUES (
	'Tony',
	'Stark',
	'tony@starknet.com',
	'Iam1ronM@n'
	);
	
--Update Tony Stark's account type to Admin
UPDATE public.account SET account_type ='Admin' WHERE account_id = 1;

--Delete Tomny Stark account from database
DELETE FROM public.account WHERE account_id = 1;

--Change GM Hummer from 'small interiors' to 'a huge interior'
UPDATE public.inventory
SET inv_description = REPLACE (inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

--Inner join to select make and model from inventory based on vehicle classification or 'Sport'
SELECT 
	inv_make, 
	inv_model
FROM 
	public.inventory
INNER JOIN
	public.classification
ON
	inventory.classification_id = classification.classification_id
WHERE 
	classification_name = 'Sport';
	
--Update the inventory table to add "/vehicle in the middle of the file path in the inv_image and inv_thumbnail columns "
UPDATE public.inventory
SET
	inv_image = REPLACE (inv_image, '/images/', './images/vehicles'),
	inv_thumbnail = REPLACE (inv_thumbnail, '/images/', './images/vehicles/');