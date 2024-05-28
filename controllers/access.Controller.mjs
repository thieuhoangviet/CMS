export const loginControlers = async (req, res, next) => {
    let errors = [];
    const { name, email, password, password2, role } = req.body;
    console.log(name, email, password, password2);
    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push('Vui lòng điền vào tất cả các trường');
    }

    if (email === "admin@gmail.com") {
        errors.push("Email này không được phép đăng ký")
    }

    // Check passwords match
    if (password !== password2) {
        errors.push('Mật khẩu không khớp');
    }

    // Check pass length
    if (!passwordRegex.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự và bao gồm ít nhất một chữ hoa, một chữ thường, một số, và một ký tự đặc biệt');
    }

    if (errors.length > 0) {
        res.render('index', {
            errors,
            name,
            email,
            password,
            password2,
            showRegistration: true
        });
    }
    else {
        try {
            const user = await User.findOne({ email, name });

            if (user) {
                errors.push('Email hoặc Doanh nghiệp đã được đăng ký');
                return res.render('index', {
                    showVerification: true,
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    showRegistration: true
                });
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã xác thực
            const newUser = new User({
                name,
                email,
                password,
                role: role || 'user',
                verificationCode,
                emailVerified: false
            });

            // Hash Password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;

            await newUser.save();

            // Gửi email xác thực
            let mailOptions = {
                from: 'thieuhoangviet63@gmail.com',
                to: newUser.email,
                subject: 'Xác Thực Email',
                text: `Mã xác thực của bạn là ${verificationCode}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    // res.redirect('/users/register');
                } else {
                    req.flash('success_msg', 'Vui lòng kiểm tra email để nhận mã xác thực.');
                    res.redirect('/users/verify?email=' + newUser.email);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}