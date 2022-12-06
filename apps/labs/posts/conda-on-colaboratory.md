---
title: 'Conda on Colaboratory'
author: surbhi-sharma
published: December 5, 2022
description: 'Sharing my exciting experience working as an intern at Quansight labs and contributing to condacolab, a tool that lets you deploy a Miniconda installation easily on Google Colab notebooks and use conda or mamba in colab.'
category: [Packaging]
featuredImage:
  src: /posts/conda-on-colaboratory/blog_feature_surbhi.svg
  alt: 'Condacolab logo with the assigned mentors and intern.'
hero:
  imageSrc: /posts/conda-on-colaboratory/blog_hero_surbhi.svg
  imageAlt: 'Condacolab logo.'
---

## Introduction

Hi, I am [Surbhi](https://github.com/ssurbhi560), and this blog post is about the work I did over the last three most exciting months in my internship at Quansight Labs. My mentor during the internship was the very amazing [Jaime Rodríguez-Guerra](https://github.com/jaimergp). The project I worked on during the internship was [condacolab](https://github.com/conda-incubator/condacolab). We will shortly go into what `condacolab` is, but before that, let's understand a little about the two familiar names that we see here, which are **conda** and **colab** and also why we needed `condacolab` in the first place.

## Why condacolab? 🐍

[Colab](https://colab.research.google.com/) is a product from Google Research and is widely used by software developers and data scientists today. Some reasons behind its success are:

* It provides a cloud-based platform to run your code. This means it is not limited by the user's computer resources (like RAM, disk space, CPU, or GPU). 
* It comes preinstalled with the most popular Python packages.
* Its free plan is enough for a lot of use cases.
* The resulting notebooks can be easily shared.

However, some users might find that Colab has some limitations in some areas, like:

* Colab is still using and locked to Python 3.7. So, if you need to use any other Python version in Colab, you won't be able to do that easily. 
* Colab ships many preinstalled packages, but users can only use `apt` or `pip` to update or obtain new ones.

This means you won't be able to use any other package manager like [conda](https://docs.conda.io/projects/conda/en/latest/), which can be a better option for certain projects and data-science fields. You might be able to do get `conda` on colab after some hacking, but this kind of workarounds tend to be break often and lack reusability.

To help folks with these limitations and make Colab more user-friendly for `conda` users, we have condacolab.

## What is condacolab, and how does it work?

[Condacolab](https://github.com/conda-incubator/condacolab) is a tool that lets you deploy a Miniconda installation easily on Google Colab notebooks and use conda or mamba in colab.

---

![Screenshot that shows the Google Colab interface on the browser with three cells of code. The first cell installs condacolab with pip. A second cell runs condacolab.install() to download and install conda to /usr/local. A third cell installs OpenMM with conda.](/posts/conda-on-colaboratory/previous_condacolab_installation.png)

---

The way condacolab worked before was by installing the Miniconda distribution on top of the system's Python at `/usr/local`, and then adding a few configuration files to ensure we stay with Python 3.7. Finally, it wrapped the Python executable to redirect and inject some environment variables needed to load the new libraries installed by `conda`. Since we need to re-read `LD_LIBRARY_PATH`, it triggered a Jupyter kernel restart.

The problem with this approach is that we are still stuck with Python 3.7 and overwriting the system's Python executable. This is not the best way because we are leaving some original Colab libraries that depend on other packages, resulting in a chaotic mixture of conda-provided files with colab-preinstalled files. In most simple cases, this doesn't present much of a problem. However, if users rely on more complex packages with compiled dependencies, chances are you would often run into difficult to debug errors due to ABI incompatibilities. 

## Adopting a better solution 🥳

The first goal we worked on during the internship was to design and implement a more robust solution to use conda and/or mamba on colab. 

After some iterations, we settled for the following approach:

1. We install the Miniconda distribution (or any other distribution) at `/opt/conda` instead of `/usr/local`.
2. We supplement the `base` environment with colab-required packages, like `google-colab`, `condatools`, `psutil`, and `matplotlib`. 
3. We overwrite `/usr/local/python` (the executable run by the default ipykernel) with a shell script that activates conda and starts our custom ipykernel, forwarding the calls there. Thanks to this step, the Jupyter server will not even notice, but we are now running conda's Python without touching the system one at all!

```
#!/bin/bash
source {prefix}/etc/profile.d/conda.sh
conda activate
unset PYTHONPATH
mv /usr/bin/lsb_release /usr/bin/lsb_release.renamed_by_condacolab.bak
exec {bin_path}/python $@
```

Bash script which activates the conda base environment and then runs the ipykernel process.

---

## Some other work we did for condacolab

### 1. Adding a `Restart kernel` button.

During the installation of condacolab the kernel is restarted automatically. This could make users feel like something is wrong with the installation or Colab. We now added a button to restart the kernel to resolve this issue. If you set `restart_kernel` to `False` during the installation, then the kernel will not restart automatically, and a button will appear, which you can click to restart the kernel.

---

![using `restart_kernel` argument to get a button for kernel restart.](/posts/conda-on-colaboratory/restart_kernel_demo.png)

---

### 2. API for customizing the conda base environment.

We also worked on building an API that would give users the option to customize the newly activated conda base environment during the condacolab installation. The API provides the following options that users can specify:

1. `environment_file`: This can be a URL or path to an environment.yaml file.
2. `specs`: This is a list of additional specifications (packages) to install.
3. `python_version`: Python version to use in the conda base environment
4. `channels`: Comma-separated list of channels to use in the conda base environment.
5. `pip_args`: List of additional packages to be installed using pip
6. `extra_conda_args`: This is a list of any extra conda arguments used during the installation.

The PR with the ongoing work for this has been opened here: [API for customizing the conda base environment. #38](https://github.com/conda-incubator/condacolab/pull/38)

```
condacolab.install(
    environment_file="https://raw.githubusercontent.com/ssurbhi560/condacolab/07b92d827f56a4628a52f4f138ae92be3de5073d/environment.yaml",
    python_version="3.10",
    specs=["matplotlib", "numpy"],
    channels=["conda-forge", "bioconda"],
    pip_args=["blue"]
    extra_conda_args=["-yq"]
    )
```

This is how users will be able to use the API while installing condacolab.

### 3. Custom installers built with the constructor.

As mentioned above, in the new solution we are using for condacolab, some extra packages are also installed (not just Miniconda), which has increased the time for the installation of condacolab. So, to save some time during the installation and make condacolab faster, we are planning on pre-bundling these extra dependencies in custom installers built with the [constructor](https://github.com/conda/constructor).

## My Learnings and Acknowledgements ✨

During my internship, I met many intelligent and cool folks at Quansight, and interacting with them helped me develop a new perspective. I am so grateful for the wonderful and invaluable experience I had during the internship. The various things I learned and discovered don't include just technical skills but also skills like better communication, collaborating, overcoming the imposter syndrome, debugging when you are stuck, and so many more. Thanks a ton to all the people who made this internship program possible. And a special thanks to Jaime for being the coolest mentor I have ever had, always helping and giving advice when I was stuck, cracking the wittiest jokes, and making our calls and work fun.