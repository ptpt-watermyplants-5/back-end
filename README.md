# back-end
### https://ptpt-watermyplants-5.herokuapp.com/
### user

{
    username: "jAppleseed",
    password: "1234",
}

## endpoints for login & register
- [POST] /auth/register
- [POST] /auth/login

required fields
{
    "username": "",
    "password": "",
};

## endpoints for user
- [GET] /user/:id
- [GET] /user/:id/plants
- [PUT] /user/:id
- [POST] /user/:id/plants
- [DELETE] /user/:id/plants/:id
