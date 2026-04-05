describe('Authentication Flow', () => {
    const baseUrl = 'http://127.0.0.1:3001/api/v1/auth';
    
    let verificationToken;
    let resetPasswordToken;
    let accessToken;
    
    const testUser = {
        name: "test User",
        email: `test1234567890@test.com`,
        password: "Password1234567890",
        phone: "01214587458"
    };
    it('should signup new user', () => {
        cy.request({
            method: 'POST',
            url: `${baseUrl}/signup`,
            body: testUser
        }).then((res) => {
            expect(res.status).to.eq(201);
            expect(res.body.message).to.eq("user created successfully");
            verificationToken = res.body.newUser.verificationToken;
        });
    });
    it('should verify email', () => {
        expect(verificationToken).to.not.be.undefined;
        cy.request({
            method: 'PUT',
            url: `${baseUrl}/verify-email/${verificationToken}`
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.eq("email verified successfully");
        });
    });
    it('should login user', () => {
        cy.request({
            method: 'GET', 
            url: `${baseUrl}/login`,
            body: {
                email: testUser.email,
                password: testUser.password
            }
        }).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body.message).to.eq("login successfully");
            expect(res.body).to.have.property('accessToken');
            accessToken = res.body.accessToken;
        });
    });
    it('should reset password', () => {
        cy.wait(10000);
        cy.request({
            method: 'POST',
            url: `${baseUrl}/forgot-password`,
            body: { email: testUser.email }
        }).then((res) => {
            expect(res.status).to.eq(200);
        });
    });
});