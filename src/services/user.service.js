const { Sequelize, Op, fn, col, literal } = require('sequelize');
const bcrypt = require('bcrypt');
const hat = require('hat');
// const Sequelize = require("sequelize");
// const Op = Sequelize.Op;
const sequelize = require('@config/env');
const { config, role, account_state, apiCode } = require('@utils/constant');
const PositionService = require('./position.service');
const CompanyService = require('./company.service');

var {
  User,
  UserProfile,
  Position,
  Role,
  Company,
  Province,
  District,
  Education,
  Experience,
  Skill,
  Volunteer,
  Project,
} = require('@models');
const { where } = require('sequelize');

const UserService = {};

UserService.create = async ({
  username,
  password,
  role_id,
  name,
  company,
  phone,
  gender,
  email,
  address,
  province_id,
  district_id,
}) => {
  return await sequelize.transaction(async (t) => {
    var hash = bcrypt.hashSync(password, config.CRYPT_SALT); // config.CRYPT_SALT = 10

    var token = hat();

    let user = await User.findOne({
      where: {
        username: username,
        is_active: account_state.ACTIVE,
      },
    });

    if (user) throw apiCode.ACCOUNT_EXIST;

    let res = await CompanyService.findOrCreate({
      name: company,
      province_id: province_id,
      district_id: district_id,
    });

    userInfo = await User.create(
      {
        username: username,
        password: hash,
        token: token,
        status: 0,
        is_active: 1,
        role_id: role_id,
        company_id: res.id,
      },
      { transaction: t },
    );

    await UserProfile.create(
      {
        user_id: userInfo.id,
        name: name,
        phone: phone,
        gender: gender,
        email: email,
        address: address,
        province_id: province_id,
        district_id: district_id,
        is_active: 1,
      },
      { transaction: t },
    );

    return userInfo.id;
  });
};

UserService.update = async ({
  user_id,
  name,
  phone,
  gender,
  email,
  address,
  province_id,
  district_id,
  dob,
  hobby,
  apply_work,
  target_work,
  cv_status,
  image = '',
}) => {
  const currentUser = await User.findOne({
    where: {
      id: user_id,
      is_active: account_state.ACTIVE,
    },
  });

  if (!currentUser) throw apiCode.NOT_FOUND;

  let dataUpdate = {
    name: name,
    phone: phone,
    gender: gender,
    email: email,
    address: address,
    province_id: province_id,
    district_id: district_id,
    dob: dob,
    hobby: hobby,
    apply_work: apply_work,
    target_work: target_work,
    // image,
  };
  if (image.length > 0) {
    dataUpdate.image = image;
  }

  await UserProfile.update(dataUpdate, {
    where: {
      user_id: user_id,
    },
  });

  await User.update(
    {
      cv_status,
    },
    { where: { id: user_id } },
  );
};

UserService.getInfo = async ({ user_id = null, token = null, username = null }) => {
  return await User.findOne({
    where: {
      [Op.or]: [{ token: token }, { id: user_id }, { username: username }],
    },
    include: [
      { model: Position },
      { model: Role },
      { model: Company, attributes: [] },
      {
        model: UserProfile,
        attributes: [
          'name',
          'email',
          'address',
          'phone',
          'gender',
          'province_id',
          'district_id',
          'hobby',
          'dob',
        ],
      },
    ],
    attributes: [
      ['id', 'user_id'],
      'username',
      'password',
      'token',
      'role_id',
      [sequelize.col('company.id'), 'company_id'],
      [sequelize.col('company.name'), 'company_name'],
      [sequelize.col('company.address'), 'company_address'],
    ],
  });
};

UserService.deleteUser = async (user) => {
  let userCurrent = await User.findOne({
    where: {
      id: user.user_id,
      // is_active: account_state.ACTIVE,
    },
  });
  if (!userCurrent) throw apiCode.NOT_FOUND;
  await User.destroy({
    where: {
      id: user.user_id,
    },
  });
};

UserService.getUserDetail = async (user_id) => {
  return await User.findOne({
    where: {
      id: user_id,
      is_active: { [Op.ne]: account_state.DELETED },
    },
    include: [
      {
        model: UserProfile,
        attributes: ['name', 'gender', 'address', 'phone', 'email', 'address', 'apply_work', 'dob'],
      },
      {
        model: Company,
      },
      {
        model: Position,
      },
    ],
    attributes: [
      'id',
      'username',
      'role_id',
      'is_active',
      'created_date',
      'company_id',
      'position_id',
    ],
  });
};

UserService.changeStatus = async (user_id, status) => {
  const userCurrent = await User.findOne({
    where: {
      id: user_id,
      is_active: { [Op.ne]: account_state.DELETED },
    },
  });

  if (!userCurrent) throw apiCode.NOT_FOUND;

  if (status === account_state.DELETED) throw apiCode.INVALID_PARAM;

  await User.update(
    {
      is_active: status,
    },
    {
      where: {
        id: user_id,
      },
    },
  );
};

UserService.getListProvince = async () => {
  const { rows } = await Province.findAndCountAll({
    where: {
      is_active: account_state.ACTIVE,
    },
    attributes: ['id', 'name', 'code'],
  });
  return {
    data: rows,
  };
};

UserService.getListDistrict = async (province_code) => {
  const { rows } = await District.findAndCountAll({
    where: {
      province_code: province_code,
      is_active: account_state.ACTIVE,
    },
    attributes: ['id', 'name', 'code', 'province_code'],
  });
  return {
    data: rows,
  };
};

UserService.createCV = async ({
  // userInfo,
  // education,
  // experience,
  // skill,
  // project,
  // volunteer
  user_id,
  name,
  phone,
  gender,
  email,
  address,
  province_id,
  district_id,
  dob,
  hobby,
  apply_work,
  target_work,
  school,
  start_time,
  end_time,
  major,
  company,
  start_time_work,
  end_time_work,
  exp_detail,
  work_location,
  organization,
  start_time_join,
  end_time_out,
  work_volumteer_detail,
  name_pro,
  start_time_pro,
  end_time_pro,
  des_pro,
  req,
}) => {
  let urlImage = '';
  if (req.files && req.files.image) {
    urlImage = await uploadFile(req.files.image, '/upload/cv/');
  }

  await sequelize.transaction(async (t) => {
    await UserService.update(
      {
        user_id: user_id,
        name: name,
        phone: phone,
        gender: gender,
        email: email,
        address: address,
        province_id: province_id,
        district_id: null,
        dob: dob,
        hobby: hobby,
        apply_work: apply_work,
        target_work: target_work,
        cv_status: 1,
        image: urlImage,
      },
      { transaction: t },
    );

    await Education.create(
      {
        user_id: user_id,
        name: school,
        start_time: start_time,
        end_time: end_time,
        major: major,
        is_active: 1,
      },
      { transaction: t },
    );

    await Experience.create(
      {
        user_id: user_id,
        name: company,
        start_time: start_time_work,
        end_time: end_time_work,
        position: work_location,
        description: exp_detail,
        is_active: 1,
      },
      { transaction: t },
    );

    await Project.create(
      {
        user_id: user_id,
        name: name_pro,
        start_time: start_time_pro,
        end_time: end_time_pro,
        description: des_pro,
        is_active: 1,
      },
      { transaction: t },
    );

    await Volunteer.create(
      {
        user_id: user_id,
        name: organization,
        start_time: start_time_join,
        end_time: end_time_out,
        description: work_volumteer_detail,
        is_active: 1,
      },
      { transaction: t },
    );
  });
  return user_id;
};

UserService.updateCV = async ({
  // userInfo,
  // education,
  // experience,
  // skill,
  // project,
  // volunteer,
  user_id,
  name,
  phone,
  gender,
  email,
  address,
  province_id,
  district_id,
  dob,
  hobby,
  apply_work,
  target_work,
  school,
  start_time,
  end_time,
  major,
  company,
  start_time_work,
  end_time_work,
  exp_detail,
  work_location,
  organization,
  start_time_join,
  end_time_out,
  work_volumteer_detail,
  name_pro,
  start_time_pro,
  end_time_pro,
  des_pro,
  req,
}) => {
  let urlImage = '';
  if (req.files && req.files.image) {
    urlImage = await uploadFile(req.files.image, '/upload/cv/');
  }

  await sequelize.transaction(async (t) => {
    await UserService.update(
      {
        user_id: user_id,
        name: name,
        phone: phone,
        gender: gender,
        email: email,
        address: address,
        province_id: province_id,
        district_id: null,
        dob: dob,
        hobby: hobby,
        apply_work: apply_work,
        target_work: target_work,
        // cv_status: 1,
        image: urlImage,
      },
      { transaction: t },
    );

    await Education.update(
      {
        name: school,
        start_time: start_time,
        end_time: end_time,
        major: major,
      },
      {
        where: {
          user_id: user_id,
        },
      },
      { transaction: t },
    );

    await Experience.update(
      {
        name: company,
        start_time: start_time_work,
        end_time: end_time_work,
        position: work_location,
        description: exp_detail,
      },
      {
        where: {
          user_id: user_id,
        },
      },
      { transaction: t },
    );

    // await Skill.create(
    //   {
    //     user_id: userInfo.user_id,
    //     name: skill.name,
    //     description: skill.description,
    //     is_active: 1,
    //   },
    //   { transaction: t }
    // );

    await Project.update(
      {
        name: name_pro,
        start_time: start_time_pro,
        end_time: end_time_pro,
        description: des_pro,
      },
      {
        where: {
          user_id: user_id,
        },
      },
      { transaction: t },
    );

    await Volunteer.update(
      {
        name: organization,
        start_time: start_time_join,
        end_time: end_time_out,
        description: work_volumteer_detail,
      },
      {
        where: {
          user_id: user_id,
        },
      },
      { transaction: t },
    );
  });
  return user_id;
};

async function uploadFile(file, pathImage) {
  try {
    const fileType = file.mimetype.replace('image/', '');
    const fileName = `${hat()}.${fileType}`;
    //Use the mv() method to place the file in upload directory
    file.mv(`./public${pathImage}` + fileName);
    // file.mv(path.join(__dirname.replace("src/controllers", ""), `public/${pathImage}` + fileName))
    return pathImage + fileName;
  } catch (error) {
    console.log(error);
    return '';
  }
}

UserService.getCVDetail = async ({ req, user_id }) => {
  const education = await Education.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['name', 'start_time', 'end_time', 'major'],
  });
  const experience = await Experience.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['name', 'start_time', 'end_time', 'description', 'position'],
  });
  const project = await Project.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['name', 'start_time', 'end_time', 'description'],
  });
  const volunteer = await Volunteer.findOne({
    where: {
      user_id: user_id,
    },
    attributes: ['name', 'start_time', 'end_time', 'description'],
  });

  const user = await User.findOne({
    where: {
      id: user_id,
    },
    include: [
      {
        model: UserProfile,
        attributes: [
          'id',
          'user_id',
          'name',
          'phone',
          'email',
          'dob',
          'address',
          'gender',
          'province_id',
          'district_id',
          'hobby',
          'apply_work',
          'target_work',
          [fn('CONCAT', req.url, col('image')), 'image'],
        ],
      },
    ],
    attributes: ['id', 'username', 'role_id', 'is_active', 'created_date', 'cv_status'],
  });
  return {
    user,
    education,
    experience,
    project,
    volunteer,
  };
};

UserService.getListCV = async ({
  req,
  search,
  province_id,
  status_id,
  page,
  offset = 0,
  limit = config.PAGING_LIMIT,
  cv_status,
}) => {
  const { rows, count } = await User.findAndCountAll({
    where: {
      // role_id: role.APPLICANT,
      [Op.and]: [
        {
          is_active: { [Op.substring]: status_id },
        },
        {
          cv_status: { [Op.substring]: cv_status },
        },
      ],
    },
    include: [
      { model: Education, attributes: ['name', 'major'] },
      { model: Experience, attributes: ['name', 'position'] },
      {
        model: UserProfile,
        attributes: [
          'id',
          'user_id',
          'name',
          'phone',
          'email',
          'dob',
          'address',
          'gender',
          'province_id',
          'district_id',
          'hobby',
          'apply_work',
          'target_work',
          [fn('CONCAT', req.url, col('image')), 'image'],
        ],
        where: {
          [Op.and]: [
            { apply_work: { [Op.substring]: search } },
            { province_id: { [Op.substring]: province_id } },
          ],
        },
      },
    ],
    attributes: ['id', 'username', 'is_active', 'role_id', 'created_date', 'cv_status'],
    limit: parseInt(limit),
    offset: (page - 1) * limit,
    order: [['id', 'DESC']],
  });

  return {
    data: rows,
    paging: { page: parseInt(page), totalItemCount: count, limit: limit },
  };
};

UserService.changeStatusCv = async ({ user_id, cv_status }) => {
  const userCurrent = await User.findOne({
    where: {
      id: user_id,
    },
  });

  if (!userCurrent) throw apiCode.NOT_FOUND;

  await User.update(
    {
      cv_status: cv_status,
    },
    {
      where: {
        id: user_id,
      },
    },
  );
};

module.exports = UserService;
