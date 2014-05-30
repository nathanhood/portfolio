'use strict';

var multiparty = require('multiparty');
var traceur = require('traceur');
var Project = traceur.require(__dirname + '/../models/project.js');

exports.index = (req, res)=>{
  Project.findAll(projects=>{
    res.render('projects/index', {projects:projects, title: 'Portfolio: List'});
  });
};

exports.new = (req, res)=>{
  res.render('projects/new', {title: 'Portfolio: New'});
};

exports.create = (req, res)=>{
  var form = new multiparty.Form();

  form.parse(req, (err, fields, files)=>{
    Project.create(res.locals.user._id, fields, files, (p)=>{
      res.redirect('/projects/' + p._id);
    });
  });
};

exports.show = (req, res)=>{
  Project.findById(req.params.id, project=>{
    res.render('projects/show', {project:project, title: 'Portfolio: Show'});
  });
};

exports.destroy = (req, res)=>{
  Project.findById(req.params.id, project=>{
    if(project.isOwner(res.locals.user)){
      project.destroy(()=>res.redirect('/projects'));
    }else{
      res.redirect('/projects');
    }
  });
};

exports.delPhoto = (req, res)=>{
  Project.findById(req.params.id, project=>{
    if(project.isOwner(res.locals.user)){
      project.delPhoto(req.params.name, ()=>res.redirect(`/projects/${project._id}`));
    }else{
      res.redirect('/projects');
    }
  });
};
